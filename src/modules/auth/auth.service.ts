import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { LoginDTO, RegisterDTO } from "./auth.schema";

export const registerUser = async (data: RegisterDTO) => {
    const existingUser = await prisma.user.findUnique({
        where: {email: data.email}
    })

    if(existingUser) {
        throw new Error("Usuário já cadastrado");
    }

   const hashedPassword = await bcrypt.hash(data.senha, 10);

  return prisma.user.create({
    data: {nome: data.nome, email: data.email, senha: hashedPassword}, 
    select: { id: true, nome: true, email: true },
  });
};

export const validateLogin = async (data: LoginDTO) => {
  const user = await prisma.user.findUnique({ 
    where: { email: data.email } 
  });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const isPasswordValid = await bcrypt.compare(data.senha, user.senha);

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  return user;
};