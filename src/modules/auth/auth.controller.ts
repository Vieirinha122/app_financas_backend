import { FastifyRequest, FastifyReply } from "fastify";
import * as AuthService from "./auth.service";
import { RegisterDTO, LoginDTO } from "./auth.schema";

export const registerController = async (
  request: FastifyRequest<{ Body: RegisterDTO }>, 
  reply: FastifyReply
) => {
  const user = await AuthService.registerUser(request.body);
  
  const token = request.server.jwt.sign({ sub: user.id });

  return reply.status(201).send({ user, token });
};

export const loginController = async (
  request: FastifyRequest<{ Body: LoginDTO }>, 
  reply: FastifyReply
) => {
  const user = await AuthService.validateLogin(request.body);

  const token = request.server.jwt.sign({ sub: user.id });

  return reply.send({ 
    token, 
    user: { id: user.id, nome: user.nome, email: user.email } 
  });
};  