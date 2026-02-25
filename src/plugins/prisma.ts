// Serve para conectar o Prisma ao Fastify

import fp from "fastify-plugin";
import { prisma } from "../lib/prisma";

export default fp(async (fastify: any) => {

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

});