import { FastifyRequest, FastifyReply } from "fastify"
import { CriarMetaDTO, AtualizarMetaDTO, AtualizarStatusDTO } from "./meta.schema"
import {
    listarMetasService,
    getMetaService,
    criarMetaService,
    atualizarMetaService,
    atualizarStatusService,
    deletarMetaService,
} from "./meta.service"

type ParamId = { Params: { id: string } }

export const listarMetasController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const metas = await listarMetasService(request.user.id)
    return reply.send(metas)
}

export const getMetaController = async (
    request: FastifyRequest<ParamId>,
    reply: FastifyReply
) => {
    const meta = await getMetaService(request.user.id, request.params.id)
    return reply.send(meta)
}

export const criarMetaController = async (
    request: FastifyRequest<{ Body: CriarMetaDTO }>,
    reply: FastifyReply
) => {
    const meta = await criarMetaService(request.user.id, request.body)
    return reply.status(201).send(meta)
}

export const atualizarMetaController = async (
    request: FastifyRequest<ParamId & { Body: AtualizarMetaDTO }>,
    reply: FastifyReply
) => {
    const meta = await atualizarMetaService(request.user.id, request.params.id, request.body)
    return reply.send(meta)
}

export const atualizarStatusController = async (
    request: FastifyRequest<ParamId & { Body: AtualizarStatusDTO }>,
    reply: FastifyReply
) => {
    const result = await atualizarStatusService(request.user.id, request.params.id, request.body)
    return reply.send(result)
}

export const deletarMetaController = async (
    request: FastifyRequest<ParamId>,
    reply: FastifyReply
) => {
    const result = await deletarMetaService(request.user.id, request.params.id)
    return reply.send(result)
}