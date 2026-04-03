export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Food"
  | "Bills"
  | "Shopping"
  | "Travel"
  | "Entertainment";

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
};