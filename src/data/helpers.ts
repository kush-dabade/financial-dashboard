import type { Transaction } from "../types";

export const calculateSummary = (transactions: Transaction[]) => {
  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  });

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const map: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  return Object.entries(map).map(([category, value]) => ({
    category,
    value,
  }));
};

export const getTopCategory = (transactions: Transaction[]) => {
  const breakdown = getCategoryBreakdown(transactions);

  if (breakdown.length === 0) return null;

  return breakdown.reduce((max, curr) =>
    curr.value > max.value ? curr : max
  );
};