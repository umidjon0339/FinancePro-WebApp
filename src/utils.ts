import type { Expense, ChartData, MonthlyData, Category } from "./types";

export const EXPENSE_CATEGORIES: Category[] = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];
export const INCOME_CATEGORIES: Category[] = ["Salary", "Freelance", "Other"];

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308"];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function calculateBalance(expenses: Expense[]) {
  const income = expenses.filter(e => e.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
  const expense = expenses.filter(e => e.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
  return { income, expense, balance: income - expense };
}

// --- Chart Logic: Generic Category Data ---
export function getChartDataByType(expenses: Expense[], type: "income" | "expense"): ChartData[] {
  const filteredItems = expenses.filter(e => e.type === type);
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return categories.map((cat, index) => {
    const total = filteredItems
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, value: total, color: COLORS[index % COLORS.length] };
  }).filter(item => item.value > 0);
}

export function getMonthlyTrendData(expenses: Expense[]): MonthlyData[] {
  const today = new Date();
  const data: MonthlyData[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = d.toLocaleString('default', { month: 'short' });
    
    const monthlyItems = expenses.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getMonth() === d.getMonth() && eDate.getFullYear() === d.getFullYear();
    });

    const income = monthlyItems.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
    const expense = monthlyItems.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);

    data.push({ name: monthKey, income, expense });
  }
  return data;
}

export function exportToCSV(expenses: Expense[]) {
  const headers = ["ID,Title,Amount,Type,Category,Date"];
  const rows = expenses.map(e => `${e.id},"${e.title}",${e.amount},${e.type},${e.category},${e.date}`);
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "finance_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function saveToStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving to local storage", e);
    }
  }
  
  export function loadFromStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error("Error loading from local storage", e);
      return fallback;
    }
  }