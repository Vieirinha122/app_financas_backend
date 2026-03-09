import {prisma} from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { CriarTransacaoDTO, AtualizarTransacaoDTO, ListagemTransacaoDTO } from "./transacao.schema";

// formata data para padrão brasileiro DD/MM/AAAA
const formatarData = (data: Date): string =>
    new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

export const criarTransacaoService = async (userId: string, data: CriarTransacaoDTO) => {
    return prisma.transacao.create({
        data: {
            ...data,
            data: data.data ?? new Date(),
            userId,
        }
    })
}

export const getAllTransacoesService = async (userId: string, filters: ListagemTransacaoDTO) => {
    const transacoes = await prisma.transacao.findMany({
        where: {
            userId,
            ...(filters.tipo && {tipo: filters.tipo}),
            ...(filters.categoria && {categoria: filters.categoria}),
            ...(filters.dataInicial || filters.dataFinal ? {
                data: {
                    ...(filters.dataInicial && {gte: filters.dataInicial}),
                    ...(filters.dataFinal && {lte: filters.dataFinal}),
                }
            } : {}),
        },
        orderBy: { data: "desc" },
    })

    // formata a data de cada transação antes de retornar
    return transacoes.map((t) => ({
        ...t,
        data: formatarData(t.data),
    }))
}

export const getTransacaoService = async (id: string, userId: string) => {
    const transacao = await prisma.transacao.findUnique({
        where: {id}
    });

    if(!transacao) {
        throw new AppError("Transação não encontrada", 404)
    }

    if (transacao.userId !== userId) {
        throw new AppError("Acesso negado", 403)
    }
    return transacao;
}

export const atualizarTransacaoService = async (id: string, userId: string, data: AtualizarTransacaoDTO) => {
    await getTransacaoService(id, userId);
    return prisma.transacao.update({
        where: {id},
        data,
    })
}

export const deletarTransacaoService = async (id: string, userId: string) => {
    await getTransacaoService(id, userId);
    return prisma.transacao.delete({
        where: {id},
    })
}