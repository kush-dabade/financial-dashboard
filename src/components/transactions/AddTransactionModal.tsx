import { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import type { Transaction, Category, TransactionType } from "../../types";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddTransactionModal = ({ open, onClose }: Props) => {
  const { addTransaction } = useFinanceStore();

  const [form, setForm] = useState({
    amount: "",
    category: "Food" as Category,
    type: "expense" as TransactionType,
    description: "",
    date: "",
  });

  if (!open) return null;

  const handleSubmit = () => {
    const amount = Number(form.amount);
    const trimmedDescription = form.description.trim();

    if (!Number.isFinite(amount) || amount <= 0 || !trimmedDescription || !form.date) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      category: form.category,
      type: form.type,
      description: trimmedDescription,
      date: form.date,
    };

    addTransaction(newTransaction);
    onClose();

    // reset form
    setForm({
      amount: "",
      category: "Food",
      type: "expense",
      description: "",
      date: "",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 micro-reveal"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4 micro-surface micro-shine micro-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold">Add Transaction</h2>

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 micro-control"
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 micro-control"
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 micro-control"
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as Category })
          }
          className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 micro-control"
        >
          <option>Food</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Travel</option>
          <option>Entertainment</option>
          <option>Salary</option>
        </select>

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value as TransactionType })
          }
          className="w-full bg-neutral-800 border border-white/10 rounded-md px-3 py-2 micro-control"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-white/10 rounded-md micro-control"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-white text-black rounded-md micro-control micro-shine"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
