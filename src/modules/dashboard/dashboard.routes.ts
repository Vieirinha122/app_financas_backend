import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { getDashboardController } from "./dashboard.controller";

export default async function dashboardRoutes(fastify: FastifyInstance) {

    const app = fastify.withTypeProvider<ZodTypeProvider>();

    app.get("/", { preHandler: [fastify.authenticate] }, getDashboardController);
}