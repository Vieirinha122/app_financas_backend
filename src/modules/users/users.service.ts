import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { CreateUserDTO, UpdateUserDTO } from "./users.schema";

export const createUser = async (data: CreateUserDTO) => {
const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (userExists) {
    throw new AppError("Usuário já existe", 409);
  }
  return prisma.user.create({data})
};

export const getAllUsers = () => { return prisma.user.findMany(); };    

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }
  return user;
};

export const updateUser = async (id: string, data: UpdateUserDTO) => {
  await getUser(id);
  return prisma.user.update({where: { id }, data})
};

export const deleteUser = async (id: string) => {
  await getUser(id);
  await prisma.user.delete({
    where: { id }
  });
};