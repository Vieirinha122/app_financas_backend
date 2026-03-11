import zod from "zod"

export const criarContribuicaoSchema = zod.object({
    valor: zod.number({ error: "Valor é obrigatório" }).positive("Valor deve ser positivo"),
    nota:  zod.string().max(200).optional(),
})

export type CriarContribuicaoDTO = zod.infer<typeof criarContribuicaoSchema>