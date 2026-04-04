import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { useFinanceStore } from "../../store/useFinanceStore";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shadow-lg">
      <p className="text-white text-sm">{label}</p>
      <p className="text-green-400 text-sm font-medium">
        ₹{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

const BalanceChart = () => {
  const { transactions } = useFinanceStore();

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const data = sorted.reduce(
    (acc, t) => {
      const prev = acc.length ? acc[acc.length - 1].balance : 0;
      const newBalance = prev + (t.type === "income" ? t.amount : -t.amount);

      acc.push({
        date: new Date(t.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        balance: newBalance,
      });

      return acc;
    },
    [] as { date: string; balance: number }[],
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-85 md:h-95 backdrop-blur-xl overflow-hidden micro-surface micro-reveal">
      <h2 className="text-lg font-semibold text-white mb-4">Balance Trend</h2>

      <div className="h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>

              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#888"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />

            <YAxis
              stroke="#888"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="none"
              fill="url(#areaGrad)"
            />

            <Line
              type="monotone"
              dataKey="balance"
              stroke="url(#lineGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#4ade80",
                stroke: "#000",
                strokeWidth: 2,
              }}
              isAnimationActive
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
