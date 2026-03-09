import { FastifyRequest, FastifyReply } from "fastify";
import * as DashboardService from "./dashboard.service";

export const getDashboardController = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const dashboard = await DashboardService.getDashboardService(userId);
    return reply.send(dashboard);
};