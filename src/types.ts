export type TransactionType = "income" | "expense";
export type Category = "Food" | "Transport" | "Shopping" | "Bills" | "Entertainment" | "Salary" | "Freelance" | "Other";
export type Theme = "light" | "dark";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: unknown; 
}

// For the Monthly Trend Bar Chart
export interface MonthlyData {
  name: string;
  income: number;
  expense: number;
}