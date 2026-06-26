import React, { useState } from 'react';
import { User, Mail, LogOut, CheckCircle, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';
import { GlassCard } from '../components/GlassCard';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { contacts, incidents, recordings } = useSafety();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setSuccess(false);
    try {
      await updateProfile({ name, email });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'June 25, 2026';
    return new Date(isoString).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">User Account Panel</h2>
        <p className="text-xs text-gray-400 mt-1">Manage credentials, review security credentials, and inspect local encryption metrics.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Profile Updates Form */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-brand-purple" />
              Identity Details
            </h3>

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Profile credentials synchronized successfully!
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">User Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/5 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-xs tracking-wider uppercase disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {loading ? 'Syncing...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Account actions: Sign Out */}
          <GlassCard className="border-rose-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-sm text-white">Sign Out of Session</h4>
              <p className="text-[10.5px] text-gray-400 mt-1">Safely close this browser session. Local encryption keys remain cached on this device.</p>
            </div>
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl bg-rose-600/15 border border-rose-500/25 hover:bg-rose-600 hover:text-white text-rose-400 font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </GlassCard>

        </div>

        {/* Right Column: Statistics */}
        <div className="space-y-6 text-left">
          
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Guardian Diagnostics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Guardian Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 font-bold text-[9px] uppercase tracking-wider">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Session User ID:</span>
                <span className="font-mono text-gray-500 text-[10px] truncate max-w-[140px]">{user?.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created At:</span>
                <span className="font-bold text-white text-[11px]">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Registered Contacts:</span>
                <span className="font-bold text-white text-[11px]">{contacts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Evidence Files Cache:</span>
                <span className="font-bold text-white text-[11px]">{recordings.length} files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Logged SOS Incidents:</span>
                <span className="font-bold text-white text-[11px]">{incidents.length} events</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard glowColor="purple" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-brand-red">
              <Heart className="w-4.5 h-4.5 fill-brand-red text-brand-red animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">SafeBand AI Shield</span>
              <span className="text-[10px] text-gray-400">Personal safety protection systems.</span>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
export default Profile;
