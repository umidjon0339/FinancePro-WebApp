import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, User, Loader2, AlertCircle, ArrowLeft, Moon, Sun } from 'lucide-react';
import { loadFromStorage, saveToStorage } from '../utils'; // Import utils to save theme
import './AuthPage.css'; // Import the CSS

export const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [debugError, setDebugError] = useState('');

  // Theme State
  const [theme, setTheme] = useState(() => loadFromStorage("theme", "light"));

  // Effect: Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveToStorage("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev: string) => (prev === "light" ? "dark" : "light"));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDebugError('');

    // 1. Validation Logic
    if (username.length < 6) {
      setDebugError("Username is too short. It must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setDebugError("Password is too short. It must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const fakeEmail = `${username.toLowerCase().replace(/\s/g, '')}@financepro.local`;

    try {
      if (isLogin) {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password });
        if (error) throw error;
      } else {
        // SIGN UP
        const { error } = await supabase.auth.signUp({ email: fakeEmail, password });
        if (error) throw error;
      }
      
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      navigate('/'); // Redirect
    } catch (error: any) {
      // Professional Error Mapping
      let msg = error.message;
      
      if (msg.includes("Invalid login credentials")) {
        msg = "Incorrect username or password. Please try again.";
      } else if (msg.includes("User already registered")) {
        msg = "This username is already taken. Please choose another.";
      } else if (msg.includes("network")) {
        msg = "Network error. Please check your internet connection.";
      }
      
      setDebugError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      
      {/* Top Navigation Bar */}
      <div className="auth-nav-top">
        <button onClick={() => navigate('/')} className="auth-btn-nav">
          <ArrowLeft size={16} /> 
          <span>Guest Mode</span>
        </button>

        <button onClick={toggleTheme} className="auth-btn-nav">
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="auth-card">
        <div className="text-center">
          <div className="auth-logo-box">
            <LayoutDashboard size={28} color="white" />
          </div>
          <h1 className="auth-title">FinancePro</h1>
          <p className="auth-subtitle">
            {isLogin ? "Welcome back! Sign in to continue." : "Start managing your wealth today."}
          </p>
        </div>

        {/* Professional Error Box */}
        {debugError && (
          <div className="auth-error">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{debugError}</span>
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div className="auth-input-group">
            <User size={18} className="auth-icon" />
            <input 
              type="text" 
              placeholder="Username" 
              className="auth-input" 
              value={username} 
              onChange={e => { setUsername(e.target.value); setDebugError(''); }} 
              required 
            />
          </div>
          
          <div className="auth-input-group">
            <Lock size={18} className="auth-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              className="auth-input" 
              value={password} 
              onChange={e => { setPassword(e.target.value); setDebugError(''); }} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="auth-footer">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setDebugError(''); }} 
            className="auth-link"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};