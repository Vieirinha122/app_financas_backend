import { prisma } from "../../lib/prisma";
import { extrairTotal, calcularVariacaoPercentual, montarDadosGrafico, formatarData } from "./dashboard.helpers";

export const getDashboardService = async (userId: string) => {
    const agora = new Date();

    // ─── Intervalos de data ───────────────────────────────────────────────────

    const inicioMesAtual = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMesAtual    = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);

    const inicioMesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
    const fimMesAnterior    = new Date(agora.getFullYear(), agora.getMonth(), 0, 23, 59, 59);

    // últimos 7 dias incluindo hoje (hoje - 6 dias)
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(agora.getDate() - 6);
    seteDiasAtras.setHours(0, 0, 0, 0);

    // ─── Queries (todas em paralelo para melhor performance) ─────────────────
    // Promise.all executa tudo ao mesmo tempo em vez de esperar uma por uma

    const [
        agregacaoTotal,       // todas as transações do usuário (pra saldo geral)
        agregacaoMesAtual,    // transações do mês atual
        agregacaoMesAnterior, // transações do mês anterior (pra calcular variação %)
        transacoesGrafico,    // despesas dos últimos 7 dias (pra montar o gráfico)
        ultimasTransacoes,    // as 3 transações mais recentes
    ] = await Promise.all([

        prisma.transacao.groupBy({
            by: ["tipo"],
            where: { userId },
            _sum: { valor: true },
        }),

        prisma.transacao.groupBy({
            by: ["tipo"],
            where: { userId, data: { gte: inicioMesAtual, lte: fimMesAtual } },
            _sum: { valor: true },
        }),

        prisma.transacao.groupBy({
            by: ["tipo"],
            where: { userId, data: { gte: inicioMesAnterior, lte: fimMesAnterior } },
            _sum: { valor: true },
        }),

        prisma.transacao.findMany({
            where: { userId, tipo: "DESPESA", data: { gte: seteDiasAtras } },
            select: { valor: true, data: true },
            orderBy: { data: "asc" },
        }),

        prisma.transacao.findMany({
            where: { userId },
            orderBy: { data: "desc" },
            take: 3,
        }),
    ]);

    // ─── Cálculos ─────────────────────────────────────────────────────────────

    // saldo total (todos os tempos)
    const totalReceitas = extrairTotal(agregacaoTotal, "RECEITA");
    const totalDespesas = extrairTotal(agregacaoTotal, "DESPESA");
    const saldoTotal    = totalReceitas - totalDespesas;

    // resumo do mês atual
    const receitasMesAtual = extrairTotal(agregacaoMesAtual, "RECEITA");
    const despesasMesAtual = extrairTotal(agregacaoMesAtual, "DESPESA");
    const saldoMesAtual    = receitasMesAtual - despesasMesAtual;

    // resumo do mês anterior
    const receitasMesAnterior = extrairTotal(agregacaoMesAnterior, "RECEITA");
    const despesasMesAnterior = extrairTotal(agregacaoMesAnterior, "DESPESA");
    const saldoMesAnterior    = receitasMesAnterior - despesasMesAnterior;

    // variação % do saldo entre o mês atual e o anterior
    const percentualVariacao = calcularVariacaoPercentual(saldoMesAtual, saldoMesAnterior);

    // dados do gráfico agrupados por dia
    const grafico = montarDadosGrafico(transacoesGrafico, seteDiasAtras);
    const totalGrafico = grafico.reduce((acc, d) => acc + d.total, 0);

    // ─── Retorno ──────────────────────────────────────────────────────────────

    return {
        resumo: {
            saldoTotal:    parseFloat(saldoTotal.toFixed(2)),
            totalReceitas: parseFloat(totalReceitas.toFixed(2)),
            totalDespesas: parseFloat(totalDespesas.toFixed(2)),
            mes: {
                receitas:           parseFloat(receitasMesAtual.toFixed(2)),
                despesas:           parseFloat(despesasMesAtual.toFixed(2)),
                saldo:              parseFloat(saldoMesAtual.toFixed(2)),
                percentualVariacao, // ex: 4.5 → "+4.5% este mês"
            },
        },
        grafico: {
            dias:         grafico,
            totalPeriodo: parseFloat(totalGrafico.toFixed(2)),
        },
        ultimasTransacoes: ultimasTransacoes.map((t) => ({
            ...t,
            data: formatarData(t.data), // Dia-mes-ano
        })),
    };
};