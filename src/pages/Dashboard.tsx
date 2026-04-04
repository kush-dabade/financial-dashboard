import Navbar from "../components/layout/Navbar";
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionTable from "../components/transactions/TransactionTable";
import BalanceChart from "../components/charts/BalanceChart";
import SpendingChart from "../components/charts/SpendingChart";
import InsightsPanel from "../components/insights/InsightsPanel";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-neutral-950 to-neutral-900 text-white">
      <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-neutral-950/70">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="micro-reveal" style={{ animationDelay: "40ms" }}>
          <SummaryCards />
        </div>
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 micro-reveal"
          style={{ animationDelay: "90ms" }}
        >
          <div className="lg:col-span-2">
            <BalanceChart />
          </div>

          <div>
            <SpendingChart />
          </div>
        </div>
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 micro-reveal"
          style={{ animationDelay: "140ms" }}
        >
          <div className="lg:col-span-2">
            <TransactionTable />
          </div>

          <div>
            <InsightsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
