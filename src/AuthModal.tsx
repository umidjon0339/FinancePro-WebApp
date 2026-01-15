import React, { useState } from 'react';
import { supabase } from './supabase';
import toast from 'react-hot-toast';
import { LayoutDashboard, Lock, User, Loader2, X, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [debugError, setDebugError] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDebugError('');

    if (username.length < 6) {
      setDebugError("Username must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const fakeEmail = `${username.toLowerCase().replace(/\s/g, '')}@financepro.local`;

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email: fakeEmail, password });
        if (error) throw error;
      }
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      onLoginSuccess();
      onClose();
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("Invalid login credentials")) msg = "Wrong username or password.";
      if (msg.includes("User already registered")) msg = "Username taken.";
      setDebugError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
            <LayoutDashboard size={20} color="white" />
          </div>
          <h2 className="text-xl font-bold">FinancePro Cloud</h2>
          <p className="text-gray-500 text-sm mt-1">{isLogin ? "Sync your data" : "Create secure account"}</p>
        </div>

        {debugError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs flex gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{debugError}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Username" className="modern-input" value={username} onChange={e => setUsername(e.target.value)} required minLength={6} style={{ paddingLeft: '34px' }} />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
            <input type="password" placeholder="Password" className="modern-input" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: '34px' }} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="mt-4 text-center text-xs">
          <button onClick={() => { setIsLogin(!isLogin); setDebugError(''); }} className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
            {isLogin ? "Create an account" : "I have an account"}
          </button>
        </div>
      </div>
    </div>
  );
};