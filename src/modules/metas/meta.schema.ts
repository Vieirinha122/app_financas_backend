import zod from "zod"

export const criarMetaSchema = zod.object({
    titulo:     zod.string().min(2, "Título deve ter pelo menos 2 caracteres").max(100),
    descricao:  zod.string().max(300).optional(),
    emoji:      zod.string().max(10).optional(),
    cor:        zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (ex: #00D084)").optional(),
    valorAlvo:  zod.number({ error: "Valor alvo é obrigatório" }).positive("Valor alvo deve ser positivo"),
    prazo:      zod.string().datetime({ message: "Data inválida" }).optional(),
    prioridade: zod.number().int().min(1).max(3).optional(),
})

export const atualizarMetaSchema = zod.object({
    titulo:     zod.string().min(2).max(100).optional(),
    descricao:  zod.string().max(300).optional(),
    emoji:      zod.string().max(10).optional(),
    cor:        zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida").optional(),
    valorAlvo:  zod.number().positive().optional(),
    prazo:      zod.string().datetime().nullable().optional(),
    prioridade: zod.number().int().min(1).max(3).optional(),
})

export const atualizarStatusSchema = zod.object({
    status: zod.enum(["ATIVA", "CONCLUIDA", "CANCELADA"]),
})

export type CriarMetaDTO       = zod.infer<typeof criarMetaSchema>
export type AtualizarMetaDTO   = zod.infer<typeof atualizarMetaSchema>
export type AtualizarStatusDTO = zod.infer<typeof atualizarStatusSchema>