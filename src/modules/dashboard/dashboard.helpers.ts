// Tipo que o Prisma retorna no groupBy de transações
type AgregacaoPrisma = {
    tipo: "RECEITA" | "DESPESA";
    _sum: { valor: number | null };
}[];

// Recebe o resultado do groupBy e o tipo que queremos extrair
// Retorna o total ou 0 se não houver nenhuma transação daquele tipo
export const extrairTotal = (agregacao: AgregacaoPrisma, tipo: "RECEITA" | "DESPESA"): number => {
    return agregacao.find((a) => a.tipo === tipo)?._sum.valor ?? 0;
};

// Calcula a variação percentual entre dois valores
// Ex: saldoAtual=1500, saldoAnterior=1000 → retorna 50.0 (cresceu 50%)
// Se o mês anterior for 0, evita divisão por zero e retorna 0
export const calcularVariacaoPercentual = (atual: number, anterior: number): number => {
    if (anterior === 0) return 0;
    return parseFloat(((atual - anterior) / Math.abs(anterior) * 100).toFixed(1));
};

// Agrupa transações por dia da semana para o gráfico
// Recebe as transações e a data de início (7 dias atrás)
// Retorna um array de 7 posições, uma pra cada dia
export const montarDadosGrafico = (
    transacoes: { valor: number; data: Date }[],
    dataInicio: Date
) => {
    const diasDaSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

    return Array.from({ length: 7 }, (_, i) => {
        // calcula qual dia é esse (dataInicio + i dias)
        const dia = new Date(dataInicio);
        dia.setDate(dataInicio.getDate() + i);

        // filtra as transações que pertencem a esse dia e soma os valores
        const totalDia = transacoes
            .filter((t) => {
                const dataTx = new Date(t.data);
                return (
                    dataTx.getFullYear() === dia.getFullYear() &&
                    dataTx.getMonth() === dia.getMonth() &&
                    dataTx.getDate() === dia.getDate()
                );
            })
            .reduce((acc, t) => acc + t.valor, 0);

        return {
            dia: diasDaSemana[dia.getDay()],         // letra do dia: "S", "T", "Q"...
            data: dia.toLocaleDateString("pt-BR", {day: "2-digit", month: "2-digit", year: "numeric"}),    // data no formato "2026-03-05"
            total: parseFloat(totalDia.toFixed(2)),
        };
    });
};

// Formata uma data para o padrão brasileiro DD/MM/AAAA
export const formatarData = (data: Date): string => {
    return new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};