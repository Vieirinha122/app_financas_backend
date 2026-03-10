import zod from "zod";

export const atualizarPerfilSchema = zod.object({
    nome: zod.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100).optional(),
    email: zod.email("O email deve ser válido").optional(),
});

export type AtualizarPerfilDTO = zod.infer<typeof atualizarPerfilSchema>;

export const atualizarSenhaSchema = zod.object({
    senhaAtual: zod.string().min(4, "Informe a senha atual"),
    novaSenha: zod.string().min(4, "A nova senha deve ter pelo menos 4 caracteres"),
    confirmarSenha: zod.string().min(4, "Confirme a nova senha"),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
});

export type AtualizarSenhaDTO = zod.infer<typeof atualizarSenhaSchema>;