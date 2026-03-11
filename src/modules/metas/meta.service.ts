import { prisma } from "../../lib/prisma"
import { AppError } from "../../errors/AppError"
import { enriquecerMeta, somarContribuicoes } from "./meta.helpers"
import { CriarMetaDTO, AtualizarMetaDTO, AtualizarStatusDTO } from "./meta.schema"

export const listarMetasService = async (userId: string) => {
    const metas = await prisma.meta.findMany({
        where:   { userId },
        orderBy: [{ prioridade: "desc" }, { createdAt: "desc" }],
        include: { contribuicoes: { select: { valor: true } } },
    })

    return metas.map((meta) =>
        enriquecerMeta(meta, somarContribuicoes(meta.contribuicoes))
    )
}

export const getMetaService = async (userId: string, metaId: string) => {
    const meta = await prisma.meta.findUnique({
        where:   { id: metaId },
        include: { contribuicoes: { orderBy: { createdAt: "desc" } } },
    })

    if (!meta) throw new AppError("Meta não encontrada", 404)
    if (meta.userId !== userId) throw new AppError("Acesso negado", 403)

    const soma = somarContribuicoes(meta.contribuicoes)

    return {
        ...enriquecerMeta(meta, soma),
        contribuicoes: meta.contribuicoes.map((c) => ({
            ...c,
            valor: parseFloat(Number(c.valor).toFixed(2)),
        })),
    }
}

export const criarMetaService = async (userId: string, data: CriarMetaDTO) => {
    const meta = await prisma.meta.create({
        data: {
            userId,
            titulo:     data.titulo,
            descricao:  data.descricao,
            emoji:      data.emoji,
            cor:        data.cor,
            valorAlvo:  data.valorAlvo,
            prazo:      data.prazo ? new Date(data.prazo) : null,
            prioridade: data.prioridade ?? 1,
        },
    })

    return enriquecerMeta(meta, 0)
}

export const atualizarMetaService = async (
    userId: string,
    metaId: string,
    data: AtualizarMetaDTO
) => {
    const meta = await prisma.meta.findUnique({ where: { id: metaId } })
    if (!meta) throw new AppError("Meta não encontrada", 404)
    if (meta.userId !== userId) throw new AppError("Acesso negado", 403)

    const atualizada = await prisma.meta.update({
        where: { id: metaId },
        data: {
            ...(data.titulo     !== undefined && { titulo:     data.titulo     }),
            ...(data.descricao  !== undefined && { descricao:  data.descricao  }),
            ...(data.emoji      !== undefined && { emoji:      data.emoji      }),
            ...(data.cor        !== undefined && { cor:        data.cor        }),
            ...(data.valorAlvo  !== undefined && { valorAlvo:  data.valorAlvo  }),
            ...(data.prioridade !== undefined && { prioridade: data.prioridade }),
            ...(data.prazo !== undefined && {
                prazo: data.prazo ? new Date(data.prazo) : null,
            }),
        },
        include: { contribuicoes: { select: { valor: true } } },
    })

    return enriquecerMeta(atualizada, somarContribuicoes(atualizada.contribuicoes))
}

export const atualizarStatusService = async (
    userId: string,
    metaId: string,
    data: AtualizarStatusDTO
) => {
    const meta = await prisma.meta.findUnique({ where: { id: metaId } })
    if (!meta) throw new AppError("Meta não encontrada", 404)
    if (meta.userId !== userId) throw new AppError("Acesso negado", 403)

    return prisma.meta.update({
        where:  { id: metaId },
        data:   { status: data.status },
        select: { id: true, status: true },
    })
}

export const deletarMetaService = async (userId: string, metaId: string) => {
    const meta = await prisma.meta.findUnique({ where: { id: metaId } })
    if (!meta) throw new AppError("Meta não encontrada", 404)
    if (meta.userId !== userId) throw new AppError("Acesso negado", 403)

    await prisma.meta.delete({ where: { id: metaId } })
    return { message: "Meta removida com sucesso" }
}