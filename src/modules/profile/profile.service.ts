import bcrypt from "bcryptjs";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { AtualizarPerfilDTO, AtualizarSenhaDTO } from "./profile.schema";


export const getPerfilService = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            nome: true,
            email: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    return user;
}

export const atualizarPerfilService = async (userId: string, data: AtualizarPerfilDTO) => {
    // se tem email novo verifica se ta em uso ja 
    if (data.email) {
        const emailEmUso = await prisma.user.findFirst({
            where: {email: data.email, NOT: {id: userId}}
        })
        if (emailEmUso) {
            throw new AppError("Email já em uso", 409);
        }
    }

    return prisma.user.update({
        where: {id: userId},
        data,
        select: { id: true, nome: true, email: true }
    })
}

export const atualizarSenhaService = async (userId: string, data: AtualizarSenhaDTO) => {
    const user = await prisma.user.findUnique({ where: {id: userId}});
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const senhaCorreta = await bcrypt.compare(data.senhaAtual, user.senha);
    if (!senhaCorreta) throw new AppError("Senha atual incorreta", 401);

    const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);

    await prisma.user.update({
        where: {id: userId},
        data: {senha: novaSenhaHash}
    })

    return {message: "Senha atualizada com sucesso"}
}