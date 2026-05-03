'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login — immediately redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden w-full absolute inset-0 z-50">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-6 glass-panel cyber-panel border border-red-900/30 mb-8 backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <ShieldCheck className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-red-600 mb-2 uppercase drop-shadow-[0_0_10px_#7f1d1d]">
            PHISHGUARD AI
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Authentication Required // Secure Sector</p>
        </div>

        <div className="glass-panel cyber-panel-alt p-8 shadow-2xl border border-red-900/20 backdrop-blur-xl bg-black/40">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-red-900 uppercase tracking-[0.2em]">Email Signature</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-red-900" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border-2 border-red-950/30 rounded-none pl-12 pr-4 py-4 focus:outline-none focus:border-red-600 text-slate-300 font-mono text-sm placeholder:text-slate-800 transition-all"
                  placeholder="IDENTITY@CORE.SEC"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black text-red-900 uppercase tracking-[0.2em]">Passkey</label>
                <a href="#" className="text-[9px] font-black text-slate-600 hover:text-red-600 uppercase tracking-widest">Bypass Request?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-red-900" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border-2 border-red-950/30 rounded-none pl-12 pr-4 py-4 focus:outline-none focus:border-red-600 text-slate-300 font-mono text-sm placeholder:text-slate-800 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-black cyber-button px-4 py-5 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 mt-8 shadow-[0_0_25px_rgba(220,38,38,0.2)] tracking-[0.3em] uppercase"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Engage
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-red-900/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
               <Activity className="w-3 h-3 text-red-900 animate-pulse" />
               <span className="text-[9px] text-slate-600 uppercase tracking-widest font-black">Authorized Access Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
