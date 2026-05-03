'use client';

import { useEffect, useState } from 'react';
import { getLogs } from '@/lib/api';
import { History, ExternalLink, ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs(page, filter);
  }, [page, filter]);

  const fetchLogs = async (p: number, v: string) => {
    setLoading(true);
    try {
      const vQuery = v ? `&verdict=${v}` : '';
      const response = await fetch(`http://localhost:5050/api/logs?page=${p}&limit=10${vQuery}`);
      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(d);
  };

  const getVerdictBadge = (verdict: string) => {
    if (verdict === 'SAFE') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/20 text-emerald-500 border border-emerald-900/30 text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5"/> SAFE</span>;
    }
    if (verdict === 'SUSPICIOUS') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 text-amber-500 border border-amber-900/30 text-[10px] font-black uppercase tracking-widest"><AlertTriangle className="w-3.5 h-3.5"/> SUSPICIOUS</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/20 text-red-500 border border-red-900/30 text-[10px] font-black uppercase tracking-widest"><ShieldAlert className="w-3.5 h-3.5"/> PHISHING</span>;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen relative z-10">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-4 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] uppercase tracking-tighter">
            <History className="w-10 h-10" />
            Scan Archive
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Historical interrogation logs and telemetry data.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-red-900 font-black uppercase tracking-[0.2em]">Filter Telemetry:</span>
          {['', 'SAFE', 'SUSPICIOUS', 'PHISHING'].map((v) => (
            <button
              key={v}
              onClick={() => { setFilter(v); setPage(1); }}
              className={`px-4 py-2 cyber-button text-[10px] font-black transition-all border uppercase tracking-widest ${
                filter === v 
                ? 'bg-red-700 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                : 'bg-black text-slate-500 border-red-900/30 hover:border-red-600 hover:text-red-500'
              }`}
            >
              {v || 'All'}
            </button>
          ))}
        </div>
      </header>

      <div className="glass-panel cyber-panel-alt rounded-none overflow-hidden border border-red-900/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono">
            <thead>
              <tr className="bg-red-950/10 border-b border-red-900/20 text-red-900 text-[10px] uppercase tracking-[0.3em]">
                <th className="p-6 font-black">Timestamp</th>
                <th className="p-6 font-black">Target URL</th>
                <th className="p-6 font-black text-center">Score</th>
                <th className="p-6 font-black">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/10 text-[10px]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-red-600 border-b-2 border-transparent mb-4"></div>
                    <p className="text-red-900 font-black tracking-widest">DECRYPTING ARCHIVE...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <History className="w-16 h-16 text-red-950 mx-auto mb-4 opacity-20" />
                    <p className="text-red-900 font-black tracking-widest">NO LOGS FOUND IN CURRENT SECTOR.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-red-950/5 transition-colors group">
                    <td className="p-6 text-slate-500 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3 max-w-xl">
                        <span className="truncate text-slate-300 font-bold group-hover:text-red-500 transition-colors" title={log.url}>{log.url}</span>
                        <a href={log.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-red-700 hover:text-red-500" />
                        </a>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`font-black text-lg ${
                        log.score < 30 ? 'text-emerald-500' : log.score < 60 ? 'text-amber-500' : 'text-red-600'
                      }`}>
                        {log.score}
                      </span>
                    </td>
                    <td className="p-6">
                      {getVerdictBadge(log.verdict)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-red-900/20 bg-black/40 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
          <div className="text-slate-600">
            Sector Intercepts: <span className="text-red-800 font-black">{(page - 1) * 10 + (logs.length > 0 ? 1 : 0)}-{(page - 1) * 10 + logs.length}</span> / <span className="text-slate-500">{totalItems}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-3 cyber-button bg-black border border-red-900/30 hover:border-red-600 disabled:opacity-20 transition-all text-red-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-black text-red-900">PAGE {page} OF {totalPages}</span>
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-3 cyber-button bg-black border border-red-900/30 hover:border-red-600 disabled:opacity-20 transition-all text-red-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
