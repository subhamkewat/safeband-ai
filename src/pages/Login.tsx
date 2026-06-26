import React, { useState } from 'react';
import { Shield, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  setView: (view: 'landing' | 'login' | 'signup') => void;
}

export const Login: React.FC<LoginProps> = ({ setView }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // AuthProvider triggers context state change, App.tsx redirects to dashboard automatically
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setEmail('guardian.safety@safeband.ai');
    setPassword('demoguardian2026');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-bg-dark">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[30%] w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] w-72 h-72 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <button 
        onClick={() => setView('landing')}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Log In Card */}
      <div className="max-w-md w-full glass-card border-white/8 rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-red to-brand-purple flex items-center justify-center shadow-lg shadow-brand-red/25 mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">Sign In to SafeBand</h2>
          <p className="text-xs text-gray-400 mt-2">Enter credentials or use our Demo Login helper</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-brand-red text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-red text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-[0_4px_20px_rgba(168,85,247,0.3)] disabled:opacity-50 cursor-pointer transition-all"
          >
            <LogIn className="w-4.5 h-4.5" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-5 border-t border-white/5 pt-4 flex flex-col gap-3">
          <button
            onClick={handleDemoSignIn}
            className="w-full py-2.5 rounded-xl bg-white/4 hover:bg-white/8 text-[11px] text-brand-purple font-bold tracking-wider uppercase border border-brand-purple/20 transition-colors cursor-pointer"
          >
            ⚡ Auto-Fill Demo Credentials
          </button>
          
          <div className="text-center text-xs text-gray-400">
            Don't have an account?{' '}
            <button 
              onClick={() => setView('signup')}
              className="text-brand-purple hover:underline font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Login;
