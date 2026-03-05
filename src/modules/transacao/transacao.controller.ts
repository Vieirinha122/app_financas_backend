import { FastifyReply, FastifyRequest } from "fastify";
import * as TransacaoService from "./transacao.service";
import { CriarTransacaoDTO, AtualizarTransacaoDTO, ListagemTransacaoDTO } from "./transacao.schema";
import { request } from "node:http";

interface IdParams {
    id: string;
}

export const criarTransacaoController = async (request: FastifyRequest<{Body: CriarTransacaoDTO}>, reply: FastifyReply) => {
    const userId = request.user.id;
    const transacao = await TransacaoService.criarTransacaoService(userId, request.body);
    return reply.status(201).send(transacao);
}

export const getAllTransacoesController = async (request: FastifyRequest<{Querystring: ListagemTransacaoDTO}>, reply: FastifyReply) => {
    const userId = request.user.id;
    const transacoes = await TransacaoService.getAllTransacoesService(userId, request.query);
    return reply.send(transacoes);
}

export const getTransacaoController = async (request: FastifyRequest<{Params: IdParams}>, reply: FastifyReply) => {
    const userId = request.user.id;
    const transacao = await TransacaoService.getTransacaoService(request.params.id, userId);
    return reply.send(transacao);
}

export const atualizarTransacaoController = async (request: FastifyRequest<{Params: IdParams, Body: AtualizarTransacaoDTO}>, reply: FastifyReply) => {
    const userId = request.user.id;
    const transacao = await TransacaoService.atualizarTransacaoService(request.params.id, userId, request.body);
    return reply.send(transacao);
}

export const deletarTransacaoController = async (request: FastifyRequest<{Params: IdParams}>, reply: FastifyReply) => {
    const userId = request.user.id;
    await TransacaoService.deletarTransacaoService(request.params.id, userId);
    return reply.status(204).send();
}
