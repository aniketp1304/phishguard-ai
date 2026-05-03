'use client';

import { useEffect, useState } from 'react';
import { getScanStats } from '@/lib/api';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  Zap,
  Globe,
  Network,
  Shield
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalScans: 0, safeCount: 0, phishingCount: 0, suspiciousCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getScanStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { date: '01 May', phishing: 4, safe: 12 },
    { date: '02 May', phishing: 7, safe: 18 },
    { date: '03 May', phishing: stats.phishingCount, safe: stats.safeCount },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse" />
          <Activity className="w-16 h-16 text-red-600 animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 max-w-7xl mx-auto space-y-8 relative z-10"
    >
      <header className="mb-12">
        <motion.h1 variants={itemVariants} className="text-4xl font-black mb-2 tracking-tight text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
          COMMAND CENTER
        </motion.h1>
        <motion.p variants={itemVariants} className="text-slate-400 text-lg uppercase font-mono tracking-widest text-xs">PhishGuard Global Intelligence Feed</motion.p>
      </header>

      {/* KPI Cards - Aggressive Asymmetric Styling */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div variants={itemVariants} className="glass-panel cyber-panel rounded-none p-6 border-red-600/20 group hover:border-red-600/50 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="w-16 h-16" /></div>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
             <Activity className="w-3 h-3 text-red-600" /> TOTAL SCANS
          </p>
          <h3 className="text-4xl font-black text-slate-100">{stats.totalScans}</h3>
        </motion.div>
        
        <motion.div variants={itemVariants} className="glass-panel cyber-panel rounded-none p-6 border-red-600/20 group hover:border-red-600/50 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldAlert className="w-16 h-16" /></div>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
             <ShieldAlert className="w-3 h-3 text-red-600" /> HOSTILE
          </p>
          <h3 className="text-4xl font-black text-red-600">{stats.phishingCount}</h3>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel cyber-panel rounded-none p-6 border-red-600/20 group hover:border-red-600/50 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Globe className="w-16 h-16" /></div>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
             <AlertTriangle className="w-3 h-3 text-amber-500" /> ANOMALIES
          </p>
          <h3 className="text-4xl font-black text-amber-500">{stats.suspiciousCount}</h3>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel cyber-panel rounded-none p-6 border-red-600/20 group hover:border-red-600/50 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldCheck className="w-16 h-16" /></div>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
             <ShieldCheck className="w-3 h-3 text-emerald-500" /> CLEARED
          </p>
          <h3 className="text-4xl font-black text-emerald-500">{stats.safeCount}</h3>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area - Asymmetric ALT */}
        <motion.div variants={itemVariants} className="glass-panel cyber-panel-alt rounded-none p-6 lg:col-span-2 border-red-600/20 group hover:border-red-600/30 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <Network className="w-5 h-5 text-red-600" />
              Threat Activity over Telemetry
            </h3>
            <div className="px-3 py-1 bg-red-950/20 text-red-500 text-[10px] font-black border border-red-900/50 uppercase tracking-[0.2em]">
              Live Feed
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPhish" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #7f1d1d', borderRadius: '0px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="phishing" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPhish)" />
                <Area type="monotone" dataKey="safe" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSafe)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="glass-panel cyber-panel rounded-none p-6 group hover:border-red-600/50 transition-colors duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-200 w-full">
              <Activity className="w-5 h-5 text-red-600" />
              Forensic Radar
            </h3>
            
            <div className="relative w-48 h-48 rounded-full border-2 border-red-900/40 bg-[#020617] overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.15)]">
              <div className="absolute inset-0 rounded-full border border-red-900/30 m-4" />
              <div className="absolute inset-0 rounded-full border border-red-900/30 m-12" />
              <div className="absolute inset-0 rounded-full border border-red-900/30 m-20" />
              <div className="absolute w-full h-[1px] bg-red-900/30 top-1/2 -translate-y-1/2" />
              <div className="absolute h-full w-[1px] bg-red-900/30 left-1/2 -translate-x-1/2" />

              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(220,38,38,0) 0%, rgba(220,38,38,0.8) 100%)',
                }}
              />
              
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute w-2 h-2 bg-red-500 rounded-full top-10 left-12 drop-shadow-[0_0_5px_#ef4444]"
              />
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
                className="absolute w-3 h-3 bg-red-400 rounded-full bottom-16 right-10 drop-shadow-[0_0_8px_#ef4444]"
              />
            </div>
            
            <div className="mt-6 flex justify-between w-full text-[10px] font-mono text-slate-500 tracking-widest">
              <span>SCANNING...</span>
              <span className="text-red-600 font-black animate-pulse">ACTIVE</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-5 cyber-panel border border-red-900/50 bg-red-950/10 relative overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.1)]">
             <div className="relative z-10">
               <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                 <Activity className="w-3 h-3" /> AI DETECTIVE NOTES
               </h3>
               <p className="text-slate-400 font-mono text-[10px] leading-relaxed border-l border-red-900 pl-3">
                 Hostile clusters detected in the EU-West region. Automated blacklisting initiated for 12.04.22.X IP range. 
               </p>
             </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
