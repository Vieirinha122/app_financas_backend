import { FastifyRequest, FastifyReply } from "fastify"
import { CriarContribuicaoDTO } from "./contribuicao.schema"
import {
    criarContribuicaoService,
    listarContribuicoesService,
    deletarContribuicaoService,
} from "./contribuicao.service"

type ParamId    = { Params: { id: string } }
type ParamIdCid = { Params: { id: string; cid: string } }

export const listarContribuicoesController = async (
    request: FastifyRequest<ParamId>,
    reply: FastifyReply
) => {
    const contribuicoes = await listarContribuicoesService(request.user.id, request.params.id)
    return reply.send(contribuicoes)
}

export const criarContribuicaoController = async (
    request: FastifyRequest<ParamId & { Body: CriarContribuicaoDTO }>,
    reply: FastifyReply
) => {
    const contribuicao = await criarContribuicaoService(
        request.user.id,
        request.params.id,
        request.body
    )
    return reply.status(201).send(contribuicao)
}

export const deletarContribuicaoController = async (
    request: FastifyRequest<ParamIdCid>,
    reply: FastifyReply
) => {
    const result = await deletarContribuicaoService(
        request.user.id,
        request.params.id,
        request.params.cid
    )
    return reply.send(result)
}