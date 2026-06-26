import React, { useState } from 'react';
import { Shield, Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignupProps {
  setView: (view: 'landing' | 'login' | 'signup') => void;
}

export const Signup: React.FC<SignupProps> = ({ setView }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      // AuthProvider triggers context state change automatically
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {/* Sign Up Card */}
      <div className="max-w-md w-full glass-card border-white/8 rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-red to-brand-purple flex items-center justify-center shadow-lg shadow-brand-red/25 mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">Create Secure Account</h2>
          <p className="text-xs text-gray-400 mt-2">Initialize your SafeBand personal key</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-brand-red text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Verify password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-sm text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-red text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-[0_4px_20px_rgba(168,85,247,0.3)] disabled:opacity-50 transition-all cursor-pointer"
          >
            <UserPlus className="w-4.5 h-4.5" />
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div className="mt-5 border-t border-white/5 pt-4 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <button 
            onClick={() => setView('login')}
            className="text-brand-purple hover:underline font-semibold"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
export default Signup;
