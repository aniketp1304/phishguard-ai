'use client';

import { useState, useEffect } from 'react';
import { scanUrl } from '@/lib/api';
import { ShieldAlert, Search, AlertCircle, ShieldCheck, Zap, Terminal, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/context/NotificationContext';

const terminalSteps = [
  "Initializing PhishGuard AI Core...",
  "Establishing secure connection...",
  "Resolving DNS & IP bindings...",
  "Fetching SSL/TLS certificates...",
  "Interrogating WHOIS registry data...",
  "Parsing HTML DOM for suspicious forms...",
  "Cross-referencing threat intelligence...",
  "Calculating final heuristic risk score..."
];

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const { addNotification } = useNotification();
  
  // Terminal state
  const [terminalIndex, setTerminalIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setTerminalIndex(0);
      interval = setInterval(() => {
        setTerminalIndex(prev => (prev < terminalSteps.length - 1 ? prev + 1 : prev));
      }, 800); 
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await scanUrl(url);
      if (data.success) {
        setResult(data.data);
        
        // Dispatch global notification based on result
        if (data.data.verdict === 'PHISHING') {
          addNotification({ type: 'alert', message: `Hostile payload detected on ${data.data.url}`, icon: ShieldAlert, color: 'red' });
        } else if (data.data.verdict === 'SUSPICIOUS') {
          addNotification({ type: 'alert', message: `Anomalies detected on ${data.data.url}`, icon: AlertTriangle, color: 'amber' });
        } else {
          addNotification({ type: 'safe', message: `Scan cleared: ${data.data.url}`, icon: ShieldCheck, color: 'emerald' });
        }
      } else {
        setError(data.error || 'Failed to scan URL');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during scanning.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'SAFE': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/50';
      case 'SUSPICIOUS': return 'text-amber-400 bg-amber-500/10 border-amber-500/50';
      case 'PHISHING': return 'text-red-400 bg-red-500/10 border-red-500/50 neon-glow-red';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 35) return 'text-emerald-400';
    if (score < 65) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 min-h-[calc(100vh-4rem)] relative z-10">
      
      {/* Background ambient light - Red instead of Blue */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center pt-8 relative z-10"
      >
        <div className="inline-flex items-center justify-center p-4 glass-panel cyber-panel rounded-none mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
          <Zap className="w-10 h-10 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
        </div>
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase text-red-600 drop-shadow-[0_0_10px_#7f1d1d]">
          Active Threat Scanner
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-xs font-mono uppercase tracking-[0.2em]">
          Deploying deep-packet interrogation & heuristic AI against target infrastructure.
        </p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-panel cyber-panel p-3 rounded-none shadow-2xl relative z-20 max-w-3xl mx-auto border-red-900/30"
      >
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3 relative group">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-red-900" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="TARGET://DOMAIN.LTD"
              className="w-full pl-14 pr-4 py-5 bg-black border-2 border-red-950/50 rounded-none focus:outline-none focus:border-red-600 transition-all text-xl font-mono placeholder:text-slate-800 shadow-inner text-slate-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url}
            className="px-8 py-5 bg-red-700 hover:bg-red-600 text-white font-black cyber-button transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap overflow-hidden relative group/btn"
          >
            {loading ? (
              <span className="relative z-10 flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                ENGAGING...
              </span>
            ) : (
              <span className="relative z-10 tracking-[0.2em] uppercase">Initialize Scan</span>
            )}
          </button>
        </form>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-3xl mx-auto overflow-hidden relative z-10"
          >
            <div className="glass-panel cyber-panel-alt p-6 border border-red-900/50 font-mono text-xs bg-black relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-red-600 border-b border-red-950 pb-2">
                <Terminal className="w-4 h-4" />
                <span className="font-black tracking-widest uppercase">Forensic Terminal Output</span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  ACTIVE
                </span>
              </div>
              <div className="space-y-2 text-slate-500 uppercase">
                {terminalSteps.slice(0, terminalIndex + 1).map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <span className="text-red-900 opacity-70">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                    <span className={idx === terminalIndex ? 'text-red-500 font-bold animate-pulse' : ''}>{step}</span>
                  </motion.div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-[100%] w-full animate-[scan_3s_linear_infinite] pointer-events-none" />
            </div>
          </motion.div>
        )}

        {!loading && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 } as const}
            className="max-w-4xl mx-auto relative z-10"
          >
            <div className={`glass-panel cyber-panel-alt rounded-none overflow-hidden border-2 shadow-2xl transition-all duration-500 ${getVerdictColor(result.verdict).split(' ').slice(1).join(' ')}`}>
              
              <div className="p-8 border-b border-red-900/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-20 ${
                  result.verdict === 'SAFE' ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent' :
                  result.verdict === 'SUSPICIOUS' ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent' :
                  'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent'
                }`} />
                
                <div className="flex items-center gap-6 relative z-10 flex-1">
                  <div className={`p-5 cyber-panel border ${getVerdictColor(result.verdict)} bg-black/80 backdrop-blur shadow-2xl`}>
                    {result.verdict === 'SAFE' ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12 animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-black mb-1 tracking-tighter uppercase">Verdict: <span className={getVerdictColor(result.verdict).split(' ')[0]}>{result.verdict}</span></h2>
                    <p className="text-slate-500 font-mono bg-black px-3 py-1 rounded inline-block max-w-md truncate border border-red-900/30 mb-3" title={result.url}>
                      {result.url}
                    </p>
                    
                    <div className="text-[10px] font-mono uppercase p-3 rounded-none bg-black border border-red-900/30">
                      {result.verdict === 'SAFE' && (
                        <span className="text-emerald-500">Trace clean. Established infrastructure telemetry confirmed. Zero heuristic matches.</span>
                      )}
                      {result.verdict === 'SUSPICIOUS' && (
                        <span className="text-amber-500">Irregularity detected. Potential staging phase or recently registered domain. Proceed with zero-trust protocols.</span>
                      )}
                      {result.verdict === 'PHISHING' && (
                        <span className="text-red-500">Critical threat identified. Malicious signature match detected in DOM/SSL layers. Interdicting traffic.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center bg-black p-5 cyber-panel border border-red-900/30 min-w-[160px] relative z-10 backdrop-blur shadow-xl">
                  <span className="text-[10px] font-black text-red-900 mb-1 tracking-widest uppercase">Heuristic Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-6xl font-black ${getScoreColor(result.score)} drop-shadow-md`}>{result.score}</span>
                  </div>
                  <span className={`text-[10px] mt-2 uppercase tracking-widest font-black px-2 py-1 bg-red-950/20 ${getScoreColor(result.score)}`}>
                    {result.riskLevel}
                  </span>
                </div>
              </div>

              <div className="p-8 bg-black/40">
                <h3 className="text-sm font-black mb-6 flex items-center gap-3 text-red-700 uppercase tracking-widest">
                  <Zap className="w-5 h-5" /> Active Detection Signals
                </h3>
                
                {result.signals && result.signals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.signals.map((signal: any, idx: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="bg-black border border-red-900/20 cyber-panel p-5 flex justify-between items-start group"
                      >
                        <div>
                          <p className="font-black text-slate-400 text-xs uppercase tracking-widest group-hover:text-red-500 transition-colors">{signal.name}</p>
                          {signal.detail && (
                            <p className="text-[10px] text-slate-600 mt-2 font-mono bg-black/50 p-2 rounded-none border border-red-900/10">
                              {Array.isArray(signal.detail) ? signal.detail.join(', ') : signal.detail}
                            </p>
                          )}
                        </div>
                        <span className={`text-[10px] px-3 py-1 font-black shadow-lg ${
                          signal.severity === 'critical' ? 'bg-red-950/20 text-red-500 border border-red-600/30' :
                          'bg-red-950/20 text-red-800 border border-red-900/20'
                        }`}>
                          {signal.weight > 0 ? '+' : ''}{signal.weight} PTS
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 cyber-panel-alt border-2 border-dashed border-emerald-900/30 bg-emerald-950/5">
                    <ShieldCheck className="w-16 h-16 text-emerald-900 mx-auto mb-4 opacity-50" />
                    <p className="text-emerald-600 font-black text-sm uppercase tracking-widest">Trace Clean. No hostiles found.</p>
                  </div>
                )}
              </div>

              {/* AI Recommendation Engine */}
              <div className="p-8 border-t border-red-900/20 bg-red-950/5 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-[10px] font-black text-red-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    Neural Mitigation Directive
                  </h3>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      {result.verdict === 'SAFE' && (
                        <p className="text-slate-500 font-mono text-[10px] leading-relaxed border-l border-emerald-600 pl-4">
                          <strong className="text-emerald-600">ANALYTICS:</strong> Telemetry aligns with established organizational infrastructure. <br/><br/>
                          <strong className="text-emerald-600">DIRECTIVE:</strong> Whitelist domain for internal routing. Log standard packets.
                        </p>
                      )}
                      {result.verdict === 'SUSPICIOUS' && (
                        <p className="text-slate-500 font-mono text-[10px] leading-relaxed border-l border-amber-600 pl-4">
                          <strong className="text-amber-600">ANALYTICS:</strong> Target exhibits high-entropy deployment volatility. <br/><br/>
                          <strong className="text-amber-600">DIRECTIVE:</strong> Quarantine outbound routing. Initiate SOC investigation.
                        </p>
                      )}
                      {result.verdict === 'PHISHING' && (
                        <p className="text-slate-500 font-mono text-[10px] leading-relaxed border-l border-red-600 pl-4">
                          <strong className="text-red-600">ANALYTICS:</strong> Confirmed hostile architecture matching harvesting signatures. <br/><br/>
                          <strong className="text-red-600">DIRECTIVE:</strong> Interdict at firewall level. Flush local DNS. Force session termination.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
    </div>
  );
}
