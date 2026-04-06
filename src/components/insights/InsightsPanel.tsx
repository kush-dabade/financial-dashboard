import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  Lightbulb,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import type { Transaction } from "../../types";

type InsightTone = "good" | "warning" | "danger" | "neutral";

type InsightItem = {
  id: string;
  tone: InsightTone;
  icon: LucideIcon;
  content: ReactNode;
  supportingText: string;
};

const toneStyles: Record<InsightTone, string> = {
  good: "border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/15",
  warning: "border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/15",
  danger: "border-rose-400/30 bg-rose-400/10 hover:bg-rose-400/15",
  neutral: "border-white/15 bg-white/5 hover:bg-white/10",
};

const toneIconStyles: Record<InsightTone, string> = {
  good: "text-emerald-300",
  warning: "text-amber-300",
  danger: "text-rose-300",
  neutral: "text-white/70",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getMonthKey = (date: string) => date.slice(0, 7);

const getLatestMonthKey = (items: Transaction[]) => {
  if (!items.length) return null;

  return items.reduce((latest, item) => {
    const key = getMonthKey(item.date);
    return key > latest ? key : latest;
  }, "0000-00");
};

const getPreviousMonthKey = (monthKey: string) => {
  const [yearRaw, monthRaw] = monthKey.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (month === 1) return `${year - 1}-12`;
  return `${year}-${String(month - 1).padStart(2, "0")}`;
};

const sumAmount = (items: Transaction[], type: "income" | "expense") =>
  items
    .filter((item) => item.type === type)
    .reduce((total, item) => total + item.amount, 0);

const InsightsPanel = () => {
  const { transactions } = useFinanceStore();

  const insights = useMemo<InsightItem[]>(() => {
    if (!transactions.length) return [];

    const latestMonth = getLatestMonthKey(transactions);
    if (!latestMonth) return [];

    const previousMonth = getPreviousMonthKey(latestMonth);

    const currentMonthTransactions = transactions.filter(
      (item) => getMonthKey(item.date) === latestMonth
    );
    const previousMonthTransactions = transactions.filter(
      (item) => getMonthKey(item.date) === previousMonth
    );

    const currentExpenses = currentMonthTransactions.filter(
      (item) => item.type === "expense"
    );
    const currentExpenseTotal = sumAmount(currentMonthTransactions, "expense");
    const previousExpenseTotal = sumAmount(previousMonthTransactions, "expense");
    const currentIncomeTotal = sumAmount(currentMonthTransactions, "income");

    const categoryMap: Record<string, number> = {};
    currentExpenses.forEach((item) => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
    });
    const sortedCategories = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    );
    const highestCategory = sortedCategories[0] || null;

    const largestExpense = transactions
      .filter((item) => item.type === "expense")
      .reduce<Transaction | null>(
        (max, item) => (!max || item.amount > max.amount ? item : max),
        null
      );

    let comparisonTone: InsightTone = "neutral";
    let comparisonContent: ReactNode = (
      <>
        Your expenses this month are{" "}
        <span className="font-semibold text-white">
          {formatCurrency(currentExpenseTotal)}
        </span>
        .
      </>
    );
    let comparisonSupporting = "No prior month data to compare yet.";

    if (previousExpenseTotal > 0) {
      const change = currentExpenseTotal - previousExpenseTotal;
      const changePct = Math.abs((change / previousExpenseTotal) * 100);
      const isIncrease = change > 0;

      comparisonTone = isIncrease
        ? changePct >= 20
          ? "danger"
          : "warning"
        : "good";
      comparisonContent = (
        <>
          Your expenses {isIncrease ? "increased" : "decreased"} by{" "}
          <span className="font-semibold text-white">{changePct.toFixed(1)}%</span>{" "}
          compared to last month.
        </>
      );
      comparisonSupporting = `${formatCurrency(currentExpenseTotal)} this month vs ${formatCurrency(previousExpenseTotal)} last month.`;
    }

    const ratio =
      currentExpenseTotal > 0 ? currentIncomeTotal / currentExpenseTotal : 0;
    const ratioTone: InsightTone =
      ratio >= 1.2 ? "good" : ratio >= 1 ? "warning" : "danger";

    const avgExpense =
      currentExpenses.length > 0 ? currentExpenseTotal / currentExpenses.length : 0;
    const largestThisMonth =
      currentExpenses.length > 0
        ? currentExpenses.reduce((max, item) =>
            item.amount > max.amount ? item : max
          )
        : null;
    const hasSpike =
      !!largestThisMonth &&
      currentExpenses.length >= 3 &&
      largestThisMonth.amount >= avgExpense * 1.8;

    const insightList: InsightItem[] = [];

    if (highestCategory && currentExpenseTotal > 0) {
      const share = (highestCategory[1] / currentExpenseTotal) * 100;
      insightList.push({
        id: "highest-category",
        tone: share >= 45 ? "warning" : "neutral",
        icon: TrendingUp,
        content: (
          <>
            <span className="font-semibold text-white">{highestCategory[0]}</span>{" "}
            is your highest spending category at{" "}
            <span className="font-semibold text-white">{share.toFixed(1)}%</span> of
            this month's expenses.
          </>
        ),
        supportingText: `${formatCurrency(highestCategory[1])} spent in ${highestCategory[0]} this month.`,
      });
    }

    insightList.push({
      id: "monthly-comparison",
      tone: comparisonTone,
      icon:
        comparisonTone === "good"
          ? ArrowDownCircle
          : comparisonTone === "danger"
            ? ArrowUpCircle
            : Lightbulb,
      content: comparisonContent,
      supportingText: comparisonSupporting,
    });

    insightList.push({
      id: "income-expense-ratio",
      tone: ratioTone,
      icon: CircleDollarSign,
      content: (
        <>
          Your income is <span className="font-semibold text-white">{ratio.toFixed(2)}x</span>{" "}
          your expenses this month.
        </>
      ),
      supportingText: `${formatCurrency(currentIncomeTotal)} income vs ${formatCurrency(currentExpenseTotal)} expenses.`,
    });

    if (largestExpense) {
      insightList.push({
        id: "largest-transaction",
        tone: "neutral",
        icon: Receipt,
        content: (
          <>
            Largest expense: <span className="font-semibold text-white">{formatCurrency(largestExpense.amount)}</span>{" "}
            on <span className="font-semibold text-white">{largestExpense.description}</span>.
          </>
        ),
        supportingText: `${largestExpense.category} • ${largestExpense.date}`,
      });
    }

    insightList.push({
      id: "spike-detection",
      tone: hasSpike ? "warning" : "good",
      icon: hasSpike ? AlertTriangle : Lightbulb,
      content: hasSpike && largestThisMonth ? (
        <>
          Unusual spike detected: <span className="font-semibold text-white">{largestThisMonth.description}</span>{" "}
          at <span className="font-semibold text-white">{formatCurrency(largestThisMonth.amount)}</span>.
        </>
      ) : (
        <>No unusual spending spikes detected in this month.</>
      ),
      supportingText: hasSpike
        ? `This transaction is much higher than your average expense (${formatCurrency(avgExpense)}).`
        : "Your spending pattern looks stable based on current entries.",
    });

    return insightList.slice(0, 5);
  }, [transactions]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full micro-surface micro-reveal">
      <h2 className="text-lg font-semibold text-white">Smart Insights</h2>
      <p className="text-sm text-white/55 mt-1 mb-4">
        Personalized analysis from your latest transactions.
      </p>

      {insights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-white/65">
          Add transactions to see insights.
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            const Icon = insight.icon;

            return (
              <div
                key={insight.id}
                className={`group rounded-xl border p-4 micro-surface transition-all duration-300 ${toneStyles[insight.tone]}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 shrink-0 rounded-lg bg-black/15 p-2 ${toneIconStyles[insight.tone]}`}
                  >
                    <Icon className="h-4 w-4 micro-icon" />
                  </div>

                  <div>
                    <p className="text-sm leading-relaxed text-white/90">{insight.content}</p>
                    <p className="mt-1 text-xs text-white/55">{insight.supportingText}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
