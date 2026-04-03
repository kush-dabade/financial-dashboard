import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFinanceStore } from "../../store/useFinanceStore";
import { getCategoryBreakdown } from "../../data/helpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg text-sm shadow-lg">
      <p className="text-white">{payload[0].name}</p>
      <p className="text-white/70">
        ₹{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

const COLORS = ["#60a5fa", "#f87171", "#facc15", "#34d399", "#c084fc"];

const SpendingChart = () => {
  const { transactions } = useFinanceStore();

  const data = getCategoryBreakdown(transactions);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-85 md:h-95 backdrop-blur-xl overflow-hidden">
      <h2 className="text-lg font-semibold text-white mb-4">
        Category Spend
      </h2>

      <div className="h-[65%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition"
                />
              ))}
            </Pie>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-sm font-semibold"
            >
              ₹{total.toLocaleString()}
            </text>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {data.map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";

          return (
            <div
              key={item.category}
              className="flex items-center gap-2 text-white/70"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
              <span>{item.category}</span>
              <span className="text-white/40">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingChart;
