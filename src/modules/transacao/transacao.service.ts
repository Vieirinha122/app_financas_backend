import {prisma} from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { CriarTransacaoDTO, AtualizarTransacaoDTO, ListagemTransacaoDTO } from "./transacao.schema";

export const criarTransacaoService = async (userId: string, data: CriarTransacaoDTO) => {
    return prisma.transacao.create({
        data: {
            ...data,                    
            data: data.data ?? new Date(), // se o usuário não mandar uma data, usa a data atual como padrão
            userId,                     // associa a transação ao usuário logado (vem do JWT, não do body)
        }
    })
}

export const getAllTransacoesService = async (userId: string, filters: ListagemTransacaoDTO) => {
    return prisma.transacao.findMany({
        where: {
            userId,                                          
            ...(filters.tipo && {tipo: filters.tipo}),       // só adiciona o filtro de tipo SE ele vier na query
            ...(filters.categoria && {categoria: filters.categoria}), 
            ...(filters.dataInicial || filters.dataFinal ? { // se vier QUALQUER uma das datas...
                data: {
                    ...(filters.dataInicial && {gte: filters.dataInicial}), // gte = maior ou igual (>=)
                    ...(filters.dataFinal && {lte: filters.dataFinal}),     // lte = menor ou igual (<=)
                }
            } : {}), // se não vier nenhuma data, passa objeto vazio (sem filtro de data)
        },
        orderBy: {
            data: "desc", // ordena do mais recente pro mais antigo
        },
    })
}

export const getTransacaoService = async (id: string, userId: string) => {
    const transacao = await prisma.transacao.findUnique({
        where: {id}
    });

    if(!transacao) {
        throw new AppError("Transação não encontrada", 404) 
    }

    // verifica se a transação existe e se ela pertence ao usuário logado
    if (transacao.userId !== userId) {
        throw new AppError("Acesso negado", 403) 
    }
    return transacao;
}

export const atualizarTransacaoService = async (id: string, userId: string, data: AtualizarTransacaoDTO) => {
    await getTransacaoService(id, userId); // reusa a função acima já validando se existe E se é dono
    return prisma.transacao.update({
        where: {id},
        data, // só atualiza os campos que vieram
    })
}

export const deletarTransacaoService = async (id: string, userId: string) => {
    await getTransacaoService(id, userId); // mesma coisa valida antes de deletar so deleta se for do usuario logado
    return prisma.transacao.delete({
        where: {id},
    })
}