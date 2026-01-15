import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { 
  Plus, Trash2, Edit2, TrendingUp, TrendingDown, Wallet, X, ChevronDown, 
  Search, Filter, ArrowDownUp, Check 
} from "lucide-react";
import type { Expense, Category, TransactionType, ChartData, MonthlyData } from "./types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, formatCurrency, formatDate } from "./utils";
import { 
     Calendar, Tag, Type, DollarSign 
  } from "lucide-react";

  import { 
    RotateCcw
  } from "lucide-react";
  
  // --- 1. Filter Bar (Single Line) ---
  interface FilterBarProps {
    search: string;
    setSearch: (val: string) => void;
    filterType: "all" | "income" | "expense";
    setFilterType: (val: "all" | "income" | "expense") => void;
    sortOrder: "newest" | "oldest" | "highest";
    setSortOrder: (val: "newest" | "oldest" | "highest") => void;
  }
  
  export const FilterBar = ({ 
    search, setSearch, filterType, setFilterType, sortOrder, setSortOrder 
  }: FilterBarProps) => {
    
    const isFiltered = search !== "" || filterType !== "all" || sortOrder !== "newest";
  
    const handleReset = () => {
      setSearch("");
      setFilterType("all");
      setSortOrder("newest");
    };
  
    return (
      <div className="filter-container">
        
        {/* 1. Search Field (Flexible Width) */}
        <div className="relative" style={{ flexGrow: 1 }}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
  
        {/* 2. Type Filter (Fixed Min-Width) */}
        <div className="relative shrink-0">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)} 
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
  
        {/* 3. Sort Filter (Fixed Min-Width) */}
        <div className="relative shrink-0">
          <ArrowDownUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as any)} 
            className="filter-select"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
  
        {/* 4. Reset Button */}
        {isFiltered && (
          <button 
            onClick={handleReset}
            className="filter-reset-btn shrink-0"
            title="Reset Filters"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    );
  };
  
  // --- 2. Professional Compact Form ---
  interface ExpenseFormProps {
    onSave: (expense: Expense) => void;
    editingExpense: Expense | null;
    cancelEdit: () => void;
  }
  
  export const ExpenseForm = ({ onSave, editingExpense, cancelEdit }: ExpenseFormProps) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<TransactionType>("expense");
    const [category, setCategory] = useState<Category>("Food");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
    useEffect(() => {
      if (editingExpense) {
        setTitle(editingExpense.title);
        setAmount(editingExpense.amount.toString());
        setType(editingExpense.type);
        setCategory(editingExpense.category);
        setDate(editingExpense.date);
      }
    }, [editingExpense]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !amount) return;
      onSave({
        id: editingExpense ? editingExpense.id : crypto.randomUUID(),
        title,
        amount: parseFloat(amount),
        type,
        category,
        date
      });
      if (!editingExpense) {
        setTitle("");
        setAmount("");
        setDate(new Date().toISOString().split('T')[0]);
      }
    };
  
    const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  
    // Common input style for compact height
    const compactInputStyle = { padding: '10px 12px 10px 38px', fontSize: '0.9rem' };
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card h-fit"
        style={{ padding: '20px' }} // Slightly reduced card padding
      >
        {/* Header */}
        <div className="flex-between mb-3">
          <h3 className="text-base font-bold text-primary flex items-center gap-2 m-0">
            {editingExpense ? <Edit2 size={16} /> : <Plus size={16} />}
            {editingExpense ? "Edit Transaction" : "New Entry"}
          </h3>
          {editingExpense && (
            <button 
              onClick={cancelEdit} 
              className="btn-icon-only text-gray-400 hover:text-danger hover:bg-red-50 p-1"
              title="Cancel Edit"
            >
              <X size={16} />
            </button>
          )}
        </div>
  
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {/* Type Toggle (Compact Margin) */}
          <div className="type-toggle" style={{ marginBottom: '8px', padding: '3px' }}>
            <button 
              type="button" 
              className={`type-btn ${type === "expense" ? "active expense" : ""}`} 
              onClick={() => { setType("expense"); setCategory("Food"); }}
              style={{ padding: '8px', fontSize: '0.85rem' }}
            >
              Expense
            </button>
            <button 
              type="button" 
              className={`type-btn ${type === "income" ? "active income" : ""}`} 
              onClick={() => { setType("income"); setCategory("Salary"); }}
              style={{ padding: '8px', fontSize: '0.85rem' }}
            >
              Income
            </button>
          </div>
  
          {/* Title Input */}
          <div className="relative group">
            <Type size={15} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Title (e.g. Groceries)" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              className="modern-input"
              style={compactInputStyle}
            />
          </div>
  
          {/* Row: Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative group">
              <DollarSign size={15} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
                className="modern-input"
                style={compactInputStyle}
              />
            </div>
            
            <div className="relative group">
              <Calendar size={15} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
                className="modern-input"
                style={compactInputStyle}
              />
            </div>
          </div>
  
          {/* Category Select */}
          <div className="relative group">
            <Tag size={15} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-primary transition-colors" />
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value as Category)} 
              className="modern-select appearance-none"
              style={compactInputStyle}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-3 pointer-events-none text-gray-400" />
          </div>
  
          {/* Submit Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn btn-primary w-full mt-1 py-2.5 shadow-md text-sm"
          >
            {editingExpense ? <Check size={16}/> : <Plus size={16}/>}
            {editingExpense ? "Update" : "Add Transaction"}
          </motion.button>
  
        </form>
      </motion.div>
    );
  };
// --- 3. Dashboard ---
interface DashboardProps {
  balance: { income: number; expense: number; balance: number };
  budgetLimit: number;
  pieDataExpense: ChartData[];
  pieDataIncome: ChartData[];
  barData: MonthlyData[];
  onUpdateBudget: (val: number) => void;
}

export const Dashboard = ({ balance, budgetLimit, pieDataExpense, pieDataIncome, barData, onUpdateBudget }: DashboardProps) => {
  const [chartTab, setChartTab] = useState<"expense" | "income">("expense");
  const activePieData = chartTab === "expense" ? pieDataExpense : pieDataIncome;
  const percentage = Math.min((balance.expense / budgetLimit) * 100, 100);

  return (
    <div className="flex-col">
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-success-light"><TrendingUp size={16} /></div>
            <span className="text-xs font-bold text-gray-400 tracking-wider">INCOME</span>
          </div>
          <div className="text-xl font-bold text-success">{formatCurrency(balance.income)}</div>
        </div>
        
        <div className="card" style={{ padding: '20px' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-danger-light"><TrendingDown size={16} /></div>
            <span className="text-xs font-bold text-gray-400 tracking-wider">EXPENSE</span>
          </div>
          <div className="text-xl font-bold text-danger">{formatCurrency(balance.expense)}</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-gray-100 text-gray-500"><Wallet size={16} /></div>
            <span className="text-xs font-bold text-gray-400 tracking-wider">BALANCE</span>
          </div>
          <div className={`text-xl font-bold ${balance.balance >= 0 ? 'text-primary' : 'text-danger'}`}>
            {formatCurrency(balance.balance)}
          </div>
        </div>
      </div>

      {/* Improved Budget Bar */}
      <div className="card">
        <div className="flex-between" style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ margin: 0 }}>Monthly Budget</h4>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 'bold', 
              padding: '2px 8px', 
              borderRadius: '6px',
              backgroundColor: percentage >= 100 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)',
              color: percentage >= 100 ? 'var(--danger)' : 'var(--primary)'
            }}>
              {percentage.toFixed(0)}%
            </span>
          </div>

          {/* Styled Input Box */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--input-bg)', 
            padding: '6px 10px', 
            borderRadius: '8px', 
            border: '1px solid rgba(148, 163, 184, 0.2)' 
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '4px' }}>Limit: $</span>
            <input 
              type="number" 
              value={budgetLimit} 
              onChange={e => onUpdateBudget(Number(e.target.value))} 
              style={{ 
                width: '100px', 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                fontWeight: 'bold', 
                color: 'var(--text-primary)',
                fontSize: '0.9rem' 
              }}
            />
          </div>
        </div>

        {/* Info Text */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          <span>{formatCurrency(balance.expense)} spent</span>
          <span>{formatCurrency(Math.max(0, budgetLimit - balance.expense))} remaining</span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '10px', background: 'var(--input-bg)', borderRadius: '10px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ 
              height: '100%', 
              background: percentage >= 100 ? 'var(--danger)' : 'var(--primary)', 
              borderRadius: '10px' 
            }}
          />
        </div>
      </div>

      {/* Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="card">
          <div className="flex-between mb-4">
            <h4>Breakdown</h4>
            {/* New Segmented Control */}
            <div className="segmented-control">
              <button onClick={() => setChartTab('expense')} className={`segment-btn ${chartTab === 'expense' ? 'active' : ''}`}>Exp</button>
              <button onClick={() => setChartTab('income')} className={`segment-btn ${chartTab === 'income' ? 'active' : ''}`}>Inc</button>
            </div>
          </div>
          <div style={{ height: '250px' }}>
            {activePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activePieData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {activePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-gray-400 text-sm">No Data</div>}
          </div>
        </div>

        <div className="card">
          <h4 className="mb-4">6-Month Trends</h4>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={6}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar name="Inc" dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar name="Exp" dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. List Component ---
interface ListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseList = ({ expenses, onDelete, onEdit }: ListProps) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleExpenses = expenses.slice(0, visibleCount);
  const hasMore = expenses.length > visibleCount;

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px' }}>Recent History</h3>
      {expenses.length === 0 ? <p className="text-center text-gray-400 py-10">No transactions found.</p> : (
        <>
          <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
            <AnimatePresence mode="popLayout">
              {visibleExpenses.map((expense) => (
                <motion.li
                  key={expense.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="transaction-item"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${expense.type === 'income' ? 'bg-success-light' : 'bg-danger-light'}`}>
                    {expense.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  
                  {/* Text Content - With Truncation */}
                  <div className="t-content">
                    <div className="t-title" title={expense.title}>{expense.title}</div>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{expense.category}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className={`font-bold text-sm ${expense.type === 'income' ? 'text-success' : 'text-danger'}`}>
                      {expense.type === 'expense' ? '-' : '+'} {formatCurrency(expense.amount)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-group">
                    <button onClick={() => onEdit(expense)} className="action-btn edit" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(expense.id)} className="action-btn delete" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          
          {hasMore && (
            <button onClick={() => setVisibleCount(prev => prev + 10)} className="w-full py-3 mt-4 text-sm font-semibold text-gray-500 hover:text-primary transition border border-dashed border-gray-300 rounded-xl hover:bg-gray-50">
              Show More
            </button>
          )}
        </>
      )}
    </div>
  );
};