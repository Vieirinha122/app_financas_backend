import { FastifyRequest, FastifyReply } from "fastify";
import * as UsersService from "./users.service";
import { CreateUserDTO, UpdateUserDTO } from "./users.schema";

interface IdParams {
  id: string;
}

export const createUserController = async ( request: FastifyRequest<{ Body: CreateUserDTO }>, reply: FastifyReply) => {
  const user = await UsersService.createUser(request.body);
  return reply.code(201).send(user);
};

export const getAllUsersController = async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await UsersService.getAllUsers();   
  return reply.send(users);
};

export const getUserController = async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
  const user = await UsersService.getUser(request.params.id);
  return reply.send(user);
};

export const updateUserController = async (request: FastifyRequest<{ Params: IdParams, Body: UpdateUserDTO }>, reply: FastifyReply) => {
  const user = await UsersService.updateUser(request.params.id, request.body);
  return reply.send(user);
};

export const deleteUserController = async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
  await UsersService.deleteUser(request.params.id);
  return reply.code(204).send();
};