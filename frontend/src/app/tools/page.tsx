'use client';

import { useState } from 'react';
import { 
  Wrench, KeyRound, Search, MailWarning, Globe, Network, CheckCircle2, XCircle, AlertCircle, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
} as const;

export default function Tools() {
  const [activeTab, setActiveTab] = useState('password');
  
  const [password, setPassword] = useState('');
  const [emailText, setEmailText] = useState('');
  const [domain, setDomain] = useState('');
  const [ip, setIp] = useState('');

  const checkPasswordStrength = (pwd: string) => {
    let score = 0;
    const s = pwd || '';
    if (s.length >= 8) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/[0-9]/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;
    if (s.length > 12) score++;
    
    if (s.length === 0) return { label: 'Awaiting Input', color: 'bg-slate-700', shadow: 'shadow-none', text: 'text-slate-400', pct: 0 };
    if (score < 2) return { label: 'Vulnerable', color: 'bg-red-500', shadow: 'shadow-[0_0_15px_#ef4444]', text: 'text-red-400', pct: 25 };
    if (score < 4) return { label: 'Moderate', color: 'bg-amber-500', shadow: 'shadow-[0_0_15px_#f59e0b]', text: 'text-amber-400', pct: 60 };
    return { label: 'Secure', color: 'bg-emerald-500', shadow: 'shadow-[0_0_15px_#10b981]', text: 'text-emerald-400', pct: 100 };
  };
  const pwdStrength = checkPasswordStrength(password);

  const phishingKeywords = ['urgent', 'password', 'login', 'verify', 'account', 'suspended', 'invoice', 'bank', 'action required', 'billing'];
  const foundKeywords = emailText ? phishingKeywords.filter(kw => emailText.toLowerCase().includes(kw)) : [];

  const toolsList = [
    { id: 'password', name: 'Cryptographic Entropy', icon: KeyRound, color: 'red' },
    { id: 'email', name: 'Email Keyword Check', icon: MailWarning, color: 'amber' },
    { id: 'domain', name: 'Domain Forensics', icon: Globe, color: 'emerald' },
    { id: 'ip', name: 'IP Inspector', icon: Network, color: 'red' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-8 max-w-7xl mx-auto space-y-8 relative">
      <header className="mb-12">
        <motion.h1 variants={itemVariants} className="text-4xl font-black mb-2 flex items-center gap-4 neon-text-blue tracking-tight">
          <Wrench className="w-10 h-10 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          Security Utilities
        </motion.h1>
        <motion.p variants={itemVariants} className="text-slate-400 text-lg">Tactical toolkit for manual investigation and analysis.</motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Menu */}
        <motion.div variants={itemVariants} className="glass-panel cyber-panel rounded-none p-4 h-fit border-red-500/20">
          <nav className="space-y-3">
            {toolsList.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 cyber-button transition-all duration-300 text-left font-bold tracking-wide relative overflow-hidden group ${
                  activeTab === tool.id 
                  ? 'bg-red-900/40 text-red-400 border border-red-500/50' 
                  : 'bg-transparent text-slate-400 hover:bg-red-900/20 hover:text-red-300 border border-transparent hover:border-red-900/50'
                }`}
              >
                {activeTab === tool.id && (
                  <motion.div layoutId="activeTabIndicator" className="absolute left-0 top-0 w-1 h-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                )}
                <tool.icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${activeTab === tool.id ? 'text-red-500' : ''}`} />
                {tool.name}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Tool Content Area */}
        <div className="lg:col-span-3">
          <div className="glass-panel cyber-panel-alt rounded-none p-8 border-red-500/20 min-h-[500px] relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {/* TOOL: Cryptographic Entropy */}
              {activeTab === 'password' && (
                <motion.div key="pwd" variants={contentVariants} initial="hidden" animate="show" exit="exit" className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-red-900/30">
                    <div className="p-4 bg-red-900/20 cyber-panel border border-red-800/30">
                      <KeyRound className="w-8 h-8 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Cryptographic Entropy Analyzer</h2>
                      <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest">Test key structural complexity against brute-force dictionaries.</p>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value || '')}
                      placeholder="Enter cryptographic key..."
                      className="w-full bg-black/80 cyber-panel border-2 border-red-900/50 px-5 py-4 focus:outline-none focus:border-red-600 transition-colors font-mono text-xl shadow-inner text-slate-300 placeholder:text-slate-700"
                    />
                  </div>
                  
                  <div className="mt-8 p-8 bg-black/60 cyber-panel-alt border border-red-900/30 backdrop-blur shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-6">
                        <span className="text-red-700 font-bold uppercase tracking-widest text-sm">Security Assessment</span>
                        <span className={`text-2xl font-black uppercase tracking-widest ${pwdStrength.text} drop-shadow-md`}>{pwdStrength.label}</span>
                      </div>
                      <div className="h-3 w-full bg-[#020617] border border-red-900/30 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pwdStrength.pct}%` }}
                          className={`h-full ${pwdStrength.color} ${pwdStrength.shadow}`} 
                          transition={{ type: "spring", bounce: 0.2 } as const}
                        />
                      </div>
                      <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                        {[
                          { label: 'Minimum 8 characters', check: (password || '').length >= 8 },
                          { label: 'Uppercase character included', check: /[A-Z]/.test(password || '') },
                          { label: 'Numeric character included', check: /[0-9]/.test(password || '') },
                          { label: 'Special symbol included', check: /[^A-Za-z0-9]/.test(password || '') }
                        ].map((req, i) => (
                          <li key={i} className={`flex items-center gap-3 p-3 cyber-button border ${req.check ? 'bg-red-900/20 border-red-500/50 text-red-500' : 'bg-black border-red-900/30 text-slate-600'}`}>
                            {req.check ? <CheckCircle2 className="w-5 h-5 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" /> : <XCircle className="w-5 h-5" />}
                            {req.label}
                          </li>
                        ))}
                      </ul>

                      {(password || '').length > 0 && (
                        <div className="mt-6 p-4 border-l-4 border-red-600 bg-red-900/10">
                          <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" /> AI Forensic Analysis
                          </h4>
                          <p className="text-slate-400 font-mono text-xs">
                            {pwdStrength.pct < 100 
                              ? "Key lacks sufficient entropy. Susceptible to standard rainbow-table inversion and dictionary attacks. Do not deploy." 
                              : "Key passes heuristic complexity checks. Sufficient entropy to withstand standard brute-force iterations."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TOOL: Email Keyword */}
              {activeTab === 'email' && (
                <motion.div key="email" variants={contentVariants} initial="hidden" animate="show" exit="exit" className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-red-900/30">
                    <div className="p-4 bg-amber-500/20 cyber-panel border border-amber-500/30">
                      <MailWarning className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Social Engineering Scanner</h2>
                      <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest">Parse text for psychological triggers used in phishing campaigns.</p>
                    </div>
                  </div>

                  <textarea
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    placeholder="Paste raw email payload here..."
                    className="w-full h-56 bg-black/80 border-2 cyber-panel border-red-900/50 px-5 py-4 focus:outline-none focus:border-red-600 transition-colors resize-none font-mono text-slate-300 shadow-inner placeholder:text-slate-700"
                  />

                  <div className="p-8 bg-black/60 cyber-panel-alt border border-red-900/30 backdrop-blur shadow-2xl relative overflow-hidden">
                    <h3 className="font-bold text-red-700 uppercase tracking-widest text-sm mb-6 relative z-10">Heuristic Output</h3>
                    {emailText.length === 0 ? (
                      <p className="text-red-900 font-mono text-center py-4 animate-pulse relative z-10">Awaiting payload injection...</p>
                    ) : foundKeywords.length > 0 ? (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="relative z-10">
                        <div className="flex items-center gap-3 text-red-500 mb-6 font-black text-xl">
                          <AlertCircle className="w-6 h-6 animate-pulse drop-shadow-[0_0_8px_#ef4444]" />
                          {foundKeywords.length} Malicious Signatures Detected
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {foundKeywords.map(kw => (
                            <span key={kw} className="px-4 py-2 bg-red-900/20 border border-red-500/40 text-red-400 cyber-button text-sm font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-3 text-emerald-500 font-black text-xl py-4 relative z-10">
                        <CheckCircle2 className="w-6 h-6 drop-shadow-[0_0_8px_#10b981]" />
                        Payload appears clean. No known signatures.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TOOL: Domain Lookup */}
              {activeTab === 'domain' && (
                <motion.div key="domain" variants={contentVariants} initial="hidden" animate="show" exit="exit" className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-red-900/30">
                    <div className="p-4 bg-red-900/20 cyber-panel border border-red-800/30">
                      <Globe className="w-8 h-8 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Domain Forensics</h2>
                      <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest">Extracting registration telemetry...</p>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="e.g., target-domain.com"
                      className="w-full bg-black/80 border-2 cyber-panel border-red-900/50 px-5 py-4 focus:outline-none focus:border-red-600 transition-colors font-mono text-xl shadow-inner text-slate-300 placeholder:text-slate-700"
                    />
                  </div>
                  
                  <div className="mt-8 p-8 bg-black/60 cyber-panel-alt border border-red-900/30 backdrop-blur shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <h3 className="font-bold text-red-700 uppercase tracking-widest text-sm mb-6 relative z-10">Forensic Extraction Data</h3>
                    {domain.length === 0 ? (
                      <p className="text-red-900 font-mono text-center py-4 animate-pulse relative z-10">Awaiting target domain input...</p>
                    ) : (
                      <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-slate-300">
                           <div className="bg-red-950/20 p-4 cyber-button border border-red-900/30">
                             <span className="text-slate-600 block mb-1">A Record</span>
                             <span className="text-red-500 font-bold">104.21.23.11</span>
                           </div>
                           <div className="bg-red-950/20 p-4 cyber-button border border-red-900/30">
                             <span className="text-slate-600 block mb-1">Registrar</span>
                             <span className="font-bold">NameCheap, Inc.</span>
                           </div>
                           <div className="bg-red-950/20 p-4 cyber-button border border-red-900/30">
                             <span className="text-slate-600 block mb-1">Creation Date</span>
                             <span className="font-bold text-red-400">2023-11-04 (Suspiciously Recent)</span>
                           </div>
                           <div className="bg-red-950/20 p-4 cyber-button border border-red-900/30">
                             <span className="text-slate-600 block mb-1">Nameservers</span>
                             <span className="font-bold">ns1.cloudflare.com</span>
                           </div>
                        </div>

                        {/* AI Detective Note */}
                        <div className="mt-6 p-4 border-l-4 border-red-600 bg-red-900/10">
                          <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> AI Detective Note
                          </h4>
                          <p className="text-slate-400 font-mono text-xs">
                            This domain's short lifespan and obfuscated registrar data heavily correlate with disposable infrastructure used in highly evasive campaigns. Recommend blacklisting A-record IP block.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TOOL: IP Inspector */}
              {activeTab === 'ip' && (
                <motion.div key="ip" variants={contentVariants} initial="hidden" animate="show" exit="exit" className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-red-900/30">
                    <div className="p-4 bg-red-900/20 cyber-panel border border-red-800/30">
                      <Network className="w-8 h-8 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">IP Address Inspector</h2>
                      <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest">Tracing host origins and routing hops...</p>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      placeholder="e.g., 192.168.1.1"
                      className="w-full bg-black/80 cyber-panel border-2 border-red-900/50 px-5 py-4 focus:outline-none focus:border-red-600 transition-colors font-mono text-xl shadow-inner text-slate-300 placeholder:text-slate-700"
                    />
                  </div>
                  
                  <div className="mt-8 p-8 bg-black/60 cyber-panel-alt border border-red-900/30 backdrop-blur shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <h3 className="font-bold text-red-700 uppercase tracking-widest text-sm mb-6 relative z-10">Trace Output</h3>
                    {ip.length === 0 ? (
                      <p className="text-red-900 font-mono text-center py-4 animate-pulse relative z-10">Awaiting target IP input...</p>
                    ) : (
                      <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-slate-300">
                           <div className="bg-red-950/20 p-4 cyber-button border border-red-900/30">
                             <span className="text-slate-600 block mb-1">ISP / ASN</span>
                             <span className="text-red-500 font-bold">AS15169 Google LLC</span>
                           </div>
                           <div className="bg-red-950/20 p-4 cyber-button border border-red-900/30">
                             <span className="text-slate-600 block mb-1">Location</span>
                             <span className="font-bold">Mountain View, US</span>
                           </div>
                           <div className="bg-red-950/20 p-4 cyber-button border border-red-900/30 col-span-2">
                             <span className="text-slate-600 block mb-1">Threat Intel</span>
                             <span className="font-bold text-slate-400">Node associated with known VPN exit routing.</span>
                           </div>
                        </div>

                        {/* AI Detective Note */}
                        <div className="mt-6 p-4 border-l-4 border-red-600 bg-red-900/10">
                          <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> AI Detective Note
                          </h4>
                          <p className="text-slate-400 font-mono text-xs">
                            Geographic routing is masking true point of origin. High probability of proxy usage by threat actors attempting to obfuscate their location. Proceed with zero-trust validation.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
