import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction } from "../types";
import { mockTransactions } from "../data/mockData";

type Role = "viewer" | "admin";

type Store = {
  transactions: Transaction[];
  role: Role;

  setRole: (role: Role) => void;
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
};

export const useFinanceStore = create<Store>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: "viewer",

      setRole: (role) => set({ role }),

      addTransaction: (t) =>
        set((state) => ({
          transactions: [t, ...state.transactions],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "finance-storage",
    }
  )
);
