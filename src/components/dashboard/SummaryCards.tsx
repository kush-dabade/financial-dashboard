import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import type { ComponentType } from "react";
import { calculateSummary } from "../../data/helpers";
import { useFinanceStore } from "../../store/useFinanceStore";
import type { Transaction } from "../../types";

type TrendData = {
  percent: number;
  positive: boolean;
  negative: boolean;
};

type SummaryMetricCardProps = {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  trend: TrendData;
  iconTone: "green" | "red" | "neutral";
  delayMs?: number;
};

const toDate = (date: string) => new Date(`${date}T00:00:00`);

const sumByType = (
  transactions: Transaction[],
  type: "income" | "expense"
) =>
  transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);

const getSignedTotal = (transactions: Transaction[]) =>
  transactions.reduce(
    (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
    0
  );

const getTrend = (current: number, previous: number): TrendData => {
  if (current === 0 && previous === 0) {
    return { percent: 0, positive: false, negative: false };
  }

  if (previous === 0) {
    return { percent: 100, positive: true, negative: false };
  }

  const percent = ((current - previous) / Math.abs(previous)) * 100;

  return {
    percent,
    positive: percent > 0,
    negative: percent < 0,
  };
};

const SummaryMetricCard = ({
  label,
  value,
  icon: Icon,
  trend,
  iconTone,
  delayMs = 0,
}: SummaryMetricCardProps) => {
  const trendColor = trend.positive
    ? "text-green-400"
    : trend.negative
      ? "text-red-400"
      : "text-white/60";

  const iconToneClass =
    iconTone === "green"
      ? "text-green-300 bg-green-500/10 border-green-400/20"
      : iconTone === "red"
        ? "text-red-300 bg-red-500/10 border-red-400/20"
        : "text-cyan-200 bg-cyan-500/10 border-cyan-400/20";

  return (
    <article
      className="group relative h-full min-h-[182px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_14px_40px_rgba(15,23,42,0.5)]"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/6 via-transparent to-transparent opacity-70" />
      <div
        className={`pointer-events-none absolute -left-2 top-14 h-16 w-28 rounded-full blur-2xl ${
          trend.negative ? "bg-red-500/15" : "bg-green-500/15"
        }`}
      />

      <div className="relative flex h-full items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/45">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.12)]">
            {"\u20B9"}
            {value.toLocaleString()}
          </p>

          <p
            className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${trendColor}`}
          >
            <span>{trend.negative ? "\u2193" : "\u2191"}</span>
            <span>
              {trend.positive ? "+" : ""}
              {trend.percent.toFixed(1)}%
            </span>
          </p>

          <p className="mt-1 text-xs text-white/35">vs last month</p>
        </div>

        <div
          className={`rounded-xl border p-2.5 transition-all duration-300 group-hover:scale-105 ${iconToneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
};

const SummaryCards = () => {
  const { transactions } = useFinanceStore();
  const { income, expenses, balance } = calculateSummary(transactions);

  const sortedByDate = [...transactions].sort(
    (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime()
  );

  const anchorDate = sortedByDate.length
    ? toDate(sortedByDate[sortedByDate.length - 1].date)
    : new Date();

  const currentMonthStart = new Date(
    anchorDate.getFullYear(),
    anchorDate.getMonth(),
    1
  );
  const previousMonthStart = new Date(
    anchorDate.getFullYear(),
    anchorDate.getMonth() - 1,
    1
  );

  const currentMonthTransactions = transactions.filter((t) => {
    const date = toDate(t.date);
    return date >= currentMonthStart;
  });

  const previousMonthTransactions = transactions.filter((t) => {
    const date = toDate(t.date);
    return date >= previousMonthStart && date < currentMonthStart;
  });

  const currentMonthIncome = sumByType(currentMonthTransactions, "income");
  const previousMonthIncome = sumByType(previousMonthTransactions, "income");
  const currentMonthExpenses = sumByType(currentMonthTransactions, "expense");
  const previousMonthExpenses = sumByType(previousMonthTransactions, "expense");

  const previousClosingBalance = getSignedTotal(
    transactions.filter((t) => toDate(t.date) < currentMonthStart)
  );

  const balanceTrend = getTrend(balance, previousClosingBalance);
  const incomeTrend = getTrend(currentMonthIncome, previousMonthIncome);
  const expensesTrend = getTrend(currentMonthExpenses, previousMonthExpenses);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      <SummaryMetricCard
        label="Total Balance"
        value={balance}
        icon={Wallet}
        trend={balanceTrend}
        iconTone="neutral"
        delayMs={80}
      />
      <SummaryMetricCard
        label="Income"
        value={income}
        icon={ArrowUpCircle}
        trend={incomeTrend}
        iconTone="green"
        delayMs={140}
      />
      <SummaryMetricCard
        label="Expenses"
        value={expenses}
        icon={ArrowDownCircle}
        trend={expensesTrend}
        iconTone="red"
        delayMs={200}
      />
    </div>
  );
};

export default SummaryCards;
