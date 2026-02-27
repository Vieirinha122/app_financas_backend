import zod from "zod";

export const registerSchema = zod.object({
  nome: zod.string().min(3),
  email: zod.email(),
  senha: zod.string().min(6),
});

export type RegisterDTO = zod.infer<typeof registerSchema>;

export const loginSchema = zod.object({
  email: zod.email(),
  senha: zod.string().min(6),
});

export type LoginDTO = zod.infer<typeof loginSchema>;
