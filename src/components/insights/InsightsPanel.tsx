import { useFinanceStore } from "../../store/useFinanceStore";
import { getTopCategory } from "../../data/helpers";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";

const categoryColors: Record<string, string> = {
  Food: "bg-orange-500/20 text-orange-300",
  Travel: "bg-blue-500/20 text-blue-300",
  Shopping: "bg-pink-500/20 text-pink-300",
  Bills: "bg-yellow-500/20 text-yellow-300",
  Entertainment: "bg-purple-500/20 text-purple-300",
  Salary: "bg-green-500/20 text-green-300",
};

const InsightsPanel = () => {
  const { transactions } = useFinanceStore();

  const topCategory = getTopCategory(transactions);

  const biggestTransaction =
    transactions.length > 0
      ? transactions.reduce((max, t) => (t.amount > max.amount ? t : max))
      : null;

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const percent =
    topCategory && totalExpenses > 0
      ? ((topCategory.value / totalExpenses) * 100).toFixed(1)
      : null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col micro-surface micro-reveal">
      
      <h2 className="text-lg font-semibold text-white mb-4">
        Insights
      </h2>

      <div className="flex flex-col flex-1 gap-4">

        <div className="group relative bg-white/5 border border-white/10 rounded-xl p-5 flex-1 transition-all duration-300 hover:bg-white/10 overflow-hidden micro-surface micro-shine">
          
          <div className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide">
                Top Spending
              </p>

              <div className="mt-2">
                {topCategory ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border border-white/10 backdrop-blur-md micro-chip ${
                      categoryColors[topCategory.category] ||
                      "bg-white/10 text-white"
                    }`}
                  >
                    {topCategory.category}
                  </span>
                ) : (
                  <span className="text-sm text-white/50">No data</span>
                )}
              </div>

              <p className="text-sm text-white/60 mt-2">
                {topCategory
                  ? `₹${topCategory.value.toLocaleString()} • ${percent}% of total`
                  : "No spending yet"}
              </p>
            </div>

            <TrendingUp className="w-5 h-5 text-white/50" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">

          <div className="group relative bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 micro-surface">
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide">
                  Highest
                </p>

                <p className="text-sm font-medium text-white mt-2 truncate">
                  {biggestTransaction
                    ? biggestTransaction.description
                    : "No data"}
                </p>

                <p className="text-xs text-white/60 mt-1">
                  {biggestTransaction
                    ? `₹${biggestTransaction.amount.toLocaleString()}`
                    : ""}
                </p>
              </div>

              <DollarSign className="w-4 h-4 text-white/50" />
            </div>
          </div>

          <div className="group relative bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 micro-surface">
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide">
                  Expenses
                </p>

                <p className="text-sm font-semibold text-red-400 mt-2">
                  ₹{totalExpenses.toLocaleString()}
                </p>

                <p className="text-xs text-white/60 mt-1">
                  Total outflow
                </p>
              </div>

              <BarChart3 className="w-4 h-4 text-white/50" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
