import { FastifyInstance } from "fastify";
import { registerController, loginController } from "./auth.controller";
import { registerSchema, loginSchema } from "./auth.schema";

export default async function authRotes(fastify: FastifyInstance) {
    fastify.post("/register", { schema: { body: registerSchema } }, registerController);
    fastify.post("/login", { schema: { body: loginSchema } }, loginController);
}