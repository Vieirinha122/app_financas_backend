import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../errors/AppError"
import { somarContribuicoes } from "../meta.helpers"
import { CriarContribuicaoDTO } from "./contribuicao.schema"

export const criarContribuicaoService = async (
    userId: string,
    metaId: string,
    data: CriarContribuicaoDTO
) => {
    const meta = await prisma.meta.findUnique({
        where:   { id: metaId },
        include: { contribuicoes: { select: { valor: true } } },
    })

    if (!meta) throw new AppError("Meta não encontrada", 404)
    if (meta.userId !== userId) throw new AppError("Acesso negado", 403)
    if (meta.status !== "ATIVA") throw new AppError("Não é possível contribuir para uma meta inativa", 400)

    const contribuicao = await prisma.metaContribuicao.create({
        data: { metaId, valor: data.valor, nota: data.nota },
    })

    // verifica se meta foi concluída após o aporte
    const somaAtualizada = somarContribuicoes(meta.contribuicoes) + data.valor
    if (somaAtualizada >= Number(meta.valorAlvo)) {
        await prisma.meta.update({
            where: { id: metaId },
            data:  { status: "CONCLUIDA" },
        })
    }

    return {
        ...contribuicao,
        valor: parseFloat(Number(contribuicao.valor).toFixed(2)),
    }
}

export const listarContribuicoesService = async (userId: string, metaId: string) => {
    const meta = await prisma.meta.findUnique({ where: { id: metaId } })
    if (!meta) throw new AppError("Meta não encontrada", 404)
    if (meta.userId !== userId) throw new AppError("Acesso negado", 403)

    const contribuicoes = await prisma.metaContribuicao.findMany({
        where:   { metaId },
        orderBy: { createdAt: "desc" },
    })

    return contribuicoes.map((c) => ({
        ...c,
        valor: parseFloat(Number(c.valor).toFixed(2)),
    }))
}

export const deletarContribuicaoService = async (
    userId: string,
    metaId: string,
    contribuicaoId: string
) => {
    const meta = await prisma.meta.findUnique({ where: { id: metaId } })
    if (!meta) throw new AppError("Meta não encontrada", 404)
    if (meta.userId !== userId) throw new AppError("Acesso negado", 403)

    const contribuicao = await prisma.metaContribuicao.findUnique({
        where: { id: contribuicaoId },
    })
    if (!contribuicao || contribuicao.metaId !== metaId)
        throw new AppError("Contribuição não encontrada", 404)

    await prisma.metaContribuicao.delete({ where: { id: contribuicaoId } })

    // se meta estava concluída, volta pra ATIVA ao remover aporte
    if (meta.status === "CONCLUIDA") {
        await prisma.meta.update({
            where: { id: metaId },
            data:  { status: "ATIVA" },
        })
    }

    return { message: "Contribuição removida com sucesso" }
}