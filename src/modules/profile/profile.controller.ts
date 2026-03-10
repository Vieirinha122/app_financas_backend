import { FastifyRequest, FastifyReply } from "fastify"
import { AtualizarPerfilDTO, AtualizarSenhaDTO } from "./profile.schema"
import { getPerfilService, atualizarPerfilService, atualizarSenhaService } from "./profile.service"

export const getPerfilController = async (request: FastifyRequest, reply: FastifyReply) => {
  const perfil = await getPerfilService(request.user.id)
  return reply.send(perfil)
}

export const atualizarPerfilController = async (
  request: FastifyRequest<{ Body: AtualizarPerfilDTO }>,
  reply: FastifyReply
) => {
  const perfil = await atualizarPerfilService(request.user.id, request.body)
  return reply.send(perfil)
}

export const atualizarSenhaController = async (
  request: FastifyRequest<{ Body: AtualizarSenhaDTO }>,
  reply: FastifyReply
) => {
  const result = await atualizarSenhaService(request.user.id, request.body)
  return reply.send(result)
}