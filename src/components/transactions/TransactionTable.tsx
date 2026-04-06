import { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import AddTransactionModal from "./AddTransactionModal";

const TransactionTable = () => {
  const { transactions, role, deleteTransaction } = useFinanceStore();
  const ITEMS_PER_PAGE = 5;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || t.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const hasActiveFilters = search.trim() !== "" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex,
  );

  const categoryColors = {
    Food: "bg-orange-500/20 text-orange-300",
    Travel: "bg-blue-500/20 text-blue-300",
    Shopping: "bg-pink-500/20 text-pink-300",
    Bills: "bg-yellow-500/20 text-yellow-300",
    Entertainment: "bg-purple-500/20 text-purple-300",
    Salary: "bg-green-500/20 text-green-300",
  };

  return (
    <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-7 micro-surface micro-reveal micro-shine">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Transactions
          </h2>
          <p className="text-sm text-white/50">
            Manage and review your activity
          </p>
        </div>

        {role === "admin" && (
          <button
            onClick={() => setOpenModal(true)}
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:scale-[1.03] active:scale-95 transition-all shadow hover:shadow-lg micro-control micro-shine"
          >
            Add Transaction
          </button>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-4 md:px-5 md:py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/45">
                Total Transactions
              </p>
              <p className="text-base font-semibold text-white">
                {filteredTransactions.length}
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/45">
                Total Income
              </p>
              <p className="text-base font-semibold text-green-400">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/45">
                Total Expense
              </p>
              <p className="text-base font-semibold text-red-400">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:justify-end">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 w-full sm:w-56 micro-control"
            />

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 micro-control"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary</option>
            </select>

            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white/80 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed micro-control"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/10 text-white/50">
              <tr className="text-left">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Type</th>
                {role === "admin" && (
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={role === "admin" ? 6 : 5}
                    className="text-center py-16 text-white/40"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">No transactions found</span>
                      <span className="text-xs text-white/30">
                        Try adjusting filters or add a new transaction
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t, index) => (
                  <tr
                    key={t.id}
                    className="group hover:bg-white/5 micro-row micro-reveal"
                    style={{ animationDelay: `${index * 28}ms` }}
                  >
                    <td className="px-5 py-4 text-white/70">{t.date}</td>

                    <td className="px-5 py-4 text-white">{t.description}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border border-white/10 micro-chip ${categoryColors[t.category]}`}
                      >
                        {t.category}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        t.type === "income"
                          ? "text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]"
                          : "text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]"
                      }`}
                    >
                      ₹{t.amount.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 capitalize text-white/60">
                      {t.type}
                    </td>

                    {role === "admin" && (
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="text-red-400 opacity-70 group-hover:opacity-100 hover:text-red-300 transition micro-control rounded-md px-2 py-1"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-white/50">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredTransactions.length)} of{" "}
            {filteredTransactions.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
              className="px-3 py-1.5 rounded-md text-sm bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/20 transition micro-control"
            >
              Previous
            </button>

            <span className="text-sm text-white/70">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="px-3 py-1.5 rounded-md text-sm bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/20 transition micro-control"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AddTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default TransactionTable;
