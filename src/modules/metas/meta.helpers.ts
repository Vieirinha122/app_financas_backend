// ─── Cálculo de progresso ────────────────────────────────────────────────────

export function calcularPercentual(valorAlvo: number, valorAtual: number): number {
    if (valorAlvo <= 0) return 0
    return parseFloat(Math.min((valorAtual / valorAlvo) * 100, 100).toFixed(1))
}

export function calcularFalta(valorAlvo: number, valorAtual: number): number {
    return parseFloat(Math.max(valorAlvo - valorAtual, 0).toFixed(2))
}

// ─── Aporte mensal sugerido baseado no prazo ─────────────────────────────────

export function calcularAporteMensal(
    valorAlvo: number,
    valorAtual: number,
    prazo: Date | null
): number | null {
    if (!prazo) return null

    const falta = calcularFalta(valorAlvo, valorAtual)
    if (falta <= 0) return null

    const agora = new Date()
    const meses =
        (prazo.getFullYear() - agora.getFullYear()) * 12 +
        (prazo.getMonth() - agora.getMonth())

    if (meses <= 0) return null
    return parseFloat((falta / meses).toFixed(2))
}

// ─── Previsão de conclusão baseada na média de aportes ──────────────────────

export function calcularPrevisao(
    valorAlvo: number,
    valorAtual: number,
    createdAt: Date
): string | null {
    if (valorAtual <= 0) return null

    const agora = new Date()
    const mesesDecorridos = Math.max(
        (agora.getFullYear() - createdAt.getFullYear()) * 12 +
        (agora.getMonth() - createdAt.getMonth()),
        1
    )

    const mediaMensal = valorAtual / mesesDecorridos
    if (mediaMensal <= 0) return null

    const falta = calcularFalta(valorAlvo, valorAtual)
    if (falta <= 0) return null

    const mesesRestantes = Math.ceil(falta / mediaMensal)
    const previsao = new Date(agora.getFullYear(), agora.getMonth() + mesesRestantes, 1)

    return previsao.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
}

// ─── Monta objeto de retorno enriquecido ─────────────────────────────────────

export function enriquecerMeta(meta: any, somaContribuicoes: number) {
    const valorAlvo  = Number(meta.valorAlvo)
    const valorAtual = somaContribuicoes

    return {
        id:          meta.id,
        titulo:      meta.titulo,
        descricao:   meta.descricao ?? null,
        emoji:       meta.emoji,
        cor:         meta.cor,
        prazo:       meta.prazo ?? null,
        prioridade:  meta.prioridade,
        status:      meta.status,
        createdAt:   meta.createdAt,
        updatedAt:   meta.updatedAt,
        valorAlvo:   parseFloat(valorAlvo.toFixed(2)),
        valorAtual:  parseFloat(valorAtual.toFixed(2)),
        percentual:  calcularPercentual(valorAlvo, valorAtual),
        falta:       calcularFalta(valorAlvo, valorAtual),
        aporteMensalSugerido: calcularAporteMensal(valorAlvo, valorAtual, meta.prazo ?? null),
        previsaoConclusao:    calcularPrevisao(valorAlvo, valorAtual, meta.createdAt),
    }
}

// ─── Soma contribuições de uma meta ─────────────────────────────────────────

export function somarContribuicoes(contribuicoes: { valor: any }[]): number {
    return contribuicoes.reduce((acc, c) => acc + Number(c.valor), 0)
}