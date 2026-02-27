// Os arquivos de schemas servem para validar os dados que chegam na API ainda antes de serem 
// processados.  
import zod from "zod"

export const createUserSchema = zod.object({
  nome: zod.string().min(3),
  email: zod.email(),
  senha: zod.string().min(6),
});

export type CreateUserDTO = zod.infer<typeof createUserSchema>;
// Schema para validar o id que vem nos parametros da rota
export const idParamsSchema = zod.object({
  id: zod.uuid(),
});

export const updateUserSchema = zod.object({
  nome: zod.string().min(3).optional(), // melhor deixar opcional pq geralmente num update nao faz tudo de uma vez
  email: zod.email().optional(),
  senha: zod.string().min(6).optional(),
});

export type UpdateUserDTO = zod.infer<typeof updateUserSchema>;

export const deleteUserSchema = zod.object({
  id: zod.uuid(),
});

export const getUserSchema = zod.object({
  id: zod.uuid(),
});

export const getAllUsersSchema = zod.object({
  id: zod.object({})
});
