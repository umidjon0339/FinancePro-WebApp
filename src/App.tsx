import { useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Download, Moon, Sun, LayoutDashboard, UserCircle, LogIn, LogOut } from "lucide-react";
import { supabase } from "./supabase";
import type { Expense, Theme } from "./types";
import { 
  calculateBalance, getChartDataByType, getMonthlyTrendData, exportToCSV, loadFromStorage, saveToStorage 
} from "./utils";
import { ExpenseForm, ExpenseList, Dashboard, FilterBar } from "./components";

function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  
  // App Data
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetLimit, setBudgetLimit] = useState<number>(() => loadFromStorage("budget", 2000));
  const [theme, setTheme] = useState<Theme>(() => loadFromStorage("theme", "light"));
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest");

  // --- Init & Session ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCloudData();
      else {
        setExpenses(loadFromStorage("expenses", []));
        setLoadingData(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setExpenses(loadFromStorage("expenses", []));
      else fetchCloudData();
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Persistence ---
  useEffect(() => { if (!session) saveToStorage("expenses", expenses); }, [expenses, session]);
  useEffect(() => { saveToStorage("budget", budgetLimit); }, [budgetLimit]);
  useEffect(() => { 
    saveToStorage("theme", theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Cloud Fetch ---
  const fetchCloudData = async () => {
    setLoadingData(true);
    const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false });
    if (data) setExpenses(data);
    setLoadingData(false);
  };

  // --- Handlers ---
  const handleSave = async (expense: Expense) => {
    if (editingId) setExpenses(prev => prev.map(e => e.id === editingId ? expense : e));
    else setExpenses(prev => [expense, ...prev]);
    toast.success(editingId ? "Updated!" : "Added!");
    setEditingId(null);

    if (session) {
      if (editingId) await supabase.from('expenses').update({ ...expense }).eq('id', editingId);
      else await supabase.from('expenses').insert([{ ...expense, user_id: session.user.id }]);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this transaction?")) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success("Deleted");
      if (session) await supabase.from('expenses').delete().eq('id', id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
  };

  // --- Filter Logic ---
  const filteredExpenses = useMemo(() => {
    let result = expenses;
    if (search) result = result.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") result = result.filter(e => e.type === filterType);
    result = [...result].sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === "highest") return b.amount - a.amount;
      return 0;
    });
    return result;
  }, [expenses, search, filterType, sortOrder]);

  const balance = calculateBalance(expenses);
  const pieDataExpense = getChartDataByType(expenses, "expense");
  const pieDataIncome = getChartDataByType(expenses, "income");
  const barData = getMonthlyTrendData(expenses);
  const editingExpense = expenses.find(e => e.id === editingId) || null;

  return (
    <div className="app-container">
      <Toaster position="bottom-center" toastOptions={{ style: { background: 'var(--card-bg)', color: 'var(--text-primary)', backdropFilter: 'blur(10px)' }}} />
      
      {/* PROFESSIONAL HEADER */}
      {/* PROFESSIONAL HEADER */}
      <header className="compact-header flex-between">
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '8px', 
            borderRadius: '10px', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)' 
          }}>
            <LayoutDashboard size={20} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            FinancePro
          </h1>
        </div>

        {/* Unified Button Row - STRICTLY ONE LINE */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          flexWrap: 'nowrap' /* Prevents wrapping */ 
        }}>
          
          {/* Utility Buttons */}
          <button onClick={() => exportToCSV(expenses)} className="btn-icon-only" title="Export CSV">
            <Download size={18} />
          </button>
          
          <button onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")} className="btn-icon-only" title="Toggle Theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {/* Divider */}
          <div style={{ width: '1px', height: '24px', background: 'var(--text-secondary)', opacity: 0.2 }}></div>

          {/* User Actions */}
          {session ? (
            <>
              <button 
                onClick={() => navigate('/profile')} 
                className="btn btn-primary" 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '10px',
                  whiteSpace: 'nowrap', /* Prevents text wrapping */
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserCircle size={18} />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <button 
                onClick={handleLogout} 
                className="btn-icon-only text-danger" 
                title="Log Out"
                style={{ borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/auth')} 
              className="btn btn-primary" 
              style={{ 
                padding: '8px 16px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={18} /> <span>Sign In</span>
            </button>
          )}
        </div>
      </header>
      
      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="flex-col">
          <ExpenseForm 
            onSave={handleSave} 
            editingExpense={editingExpense} 
            cancelEdit={() => setEditingId(null)} 
          />
          <div className="card">
             <FilterBar 
               search={search} setSearch={setSearch}
               filterType={filterType} setFilterType={setFilterType}
               sortOrder={sortOrder} setSortOrder={setSortOrder}
             />
             {loadingData ? <div className="py-10 text-center text-gray-400">Syncing data...</div> : (
               <ExpenseList 
                 expenses={filteredExpenses} 
                 onDelete={handleDelete} 
                 onEdit={(e) => { setEditingId(e.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
               />
             )}
          </div>
        </div>

        <div>
          <Dashboard 
            balance={balance} 
            budgetLimit={budgetLimit} 
            onUpdateBudget={setBudgetLimit}
            pieDataExpense={pieDataExpense}
            pieDataIncome={pieDataIncome}
            barData={barData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;