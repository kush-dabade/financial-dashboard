import { useFinanceStore } from "../../store/useFinanceStore";
import { calculateSummary } from "../../data/helpers";

const Spark = ({ positive = true }: { positive?: boolean }) => (
  <div className="flex items-end gap-0.5 h-6">
    {[4, 8, 6, 10, 7, 12].map((h, i) => (
      <div
        key={i}
        className={`w-0.75 rounded-full ${
          positive ? "bg-green-400/70" : "bg-red-400/70"
        }`}
        style={{ height: `${h}px` }}
      />
    ))}
  </div>
);

const SummaryCards = () => {
  const { transactions } = useFinanceStore();
  const { income, expenses, balance } = calculateSummary(transactions);

  const savingsRate =
    income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      <div
        className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden micro-surface micro-shine shadow-[0_0_50px_rgba(0,0,0,0.7)] micro-reveal"
        style={{ animationDelay: "80ms" }}
      >

        <div className="absolute inset-0 bg-linear-to-r from-green-400/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition" />

        <div className="h-0.5 w-full bg-linear-to-r from-green-400 to-emerald-600 mb-5" />

        <p className="text-sm text-white/50 tracking-wide">
          Total Balance
        </p>

        <div className="flex items-end justify-between mt-2">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            ₹{balance.toLocaleString()}
          </h2>

          <Spark positive={balance >= 0} />
        </div>

        <p className="text-xs text-white/30 mt-2">
          Savings rate:{" "}
          <span className="text-white/70 font-medium">
            {savingsRate}%
          </span>
        </p>
      </div>

      <div
        className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden micro-surface micro-shine shadow-[0_0_40px_rgba(0,0,0,0.6)] micro-reveal"
        style={{ animationDelay: "140ms" }}
      >

        <div className="absolute inset-0 bg-linear-to-r from-green-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition" />

        <div className="h-0.5 w-full bg-linear-to-r from-green-400 to-green-500 mb-5" />

        <p className="text-sm text-white/50 tracking-wide">
          Income
        </p>

        <div className="flex items-end justify-between mt-2">
          <h2 className="text-2xl font-semibold text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]">
            ₹{income.toLocaleString()}
          </h2>

          <Spark positive />
        </div>

        <p className="text-xs text-white/30 mt-2">
          All incoming funds
        </p>
      </div>

      <div
        className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden micro-surface micro-shine shadow-[0_0_40px_rgba(0,0,0,0.6)] micro-reveal"
        style={{ animationDelay: "200ms" }}
      >

        <div className="absolute inset-0 bg-linear-to-r from-red-400/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition" />

        <div className="h-0.5 w-full bg-linear-to-r from-red-400 to-red-500 mb-5" />

        <p className="text-sm text-white/50 tracking-wide">
          Expenses
        </p>

        <div className="flex items-end justify-between mt-2">
          <h2 className="text-2xl font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]">
            ₹{expenses.toLocaleString()}
          </h2>

          <Spark positive={false} />
        </div>

        <p className="text-xs text-white/30 mt-2">
          Total outgoing spend
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
