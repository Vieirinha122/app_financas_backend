import zod from "zod";

// enum
export const TipoTransacao = zod.enum(["RECEITA", "DESPESA"]);

export const criarTransacaoSchema = zod.object({
    descricao: zod.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
    valor: zod.number().min(1, "Valor deve ser maior que 0"),
    tipo: TipoTransacao,
    data: zod.coerce.date().optional(),
    categoria: zod.string().min(3, "Categoria deve ter pelo menos 3 caracteres"),
})

export type CriarTransacaoDTO = zod.infer<typeof criarTransacaoSchema>

export const idParamsSchema = zod.object({
    id: zod.uuid(),
})

export type IdParamsSchema = zod.infer<typeof idParamsSchema>

export const atualizarTransacaoSchema = zod.object({
    tipo: TipoTransacao.optional(),
    descricao: zod.string().min(3, "Descrição deve ter pelo menos 3 caracteres").optional(),
    valor: zod.number().min(1, "Valor deve ser maior que 0").optional(),
    data: zod.coerce.date().optional(),
    categoria: zod.string().min(3, "Categoria deve ter pelo menos 3 caracteres").optional(),
})

export type AtualizarTransacaoDTO = zod.infer<typeof atualizarTransacaoSchema>

// Para filtros na listagem

export const listagemTransacaoSchema = zod.object({
  tipo: TipoTransacao.optional(),
  categoria: zod.string().optional(),
  dataInicial: zod.coerce.date().optional(),
  dataFinal: zod.coerce.date().optional(),
})

export type ListagemTransacaoDTO = zod.infer<typeof listagemTransacaoSchema>