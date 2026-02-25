import { FastifyInstance } from "fastify";
import { AppError } from "../errors/AppError";

export async function errorHandler(app: FastifyInstance) {

  app.setErrorHandler((error: any, request: any, reply: any) => {

    request.log.error(error);

    if (error instanceof AppError) {

      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (error.validation) {

      return reply.status(400).send({
        message: "Erro de validação",
        issues: error.validation,
      });

    }

    return reply.status(500).send({
      message: "Erro interno do servidor",
    });

  });

}