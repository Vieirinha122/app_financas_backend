import "@fastify/jwt"

declare module "@fastify/jwt" {
    export interface FastifyJWT {
      payload: {
        id: string;
      },
      user: {
            id: string;
        }
    }
}

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}