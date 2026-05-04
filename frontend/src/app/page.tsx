'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Server, Globe, Cpu, ChevronRight, Lock, Activity, Eye, Zap, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- UTILS ---
const randomChar = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";
  return chars[Math.floor(Math.random() * chars.length)];
};

// --- COMPONENTS ---

const DecryptText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return randomChar();
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="font-mono">{displayText}</span>;
};

const MagneticButton = ({ children, onClick, className }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 } as const}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const TechNode = ({ icon: Icon, title, desc, delay, x, y }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, x: x - 50, y: y + 50 }}
      animate={isInView ? { opacity: 1, scale: 1, x, y } : {}}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 } as const}
      className="absolute glass-panel cyber-panel p-4 border border-red-500/30 flex items-center gap-4 group"
    >
      <div className="p-3 bg-red-500/20 cyber-button group-hover:bg-red-500/40 transition-colors">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
      <div>
        <h4 className="font-bold text-slate-200 uppercase text-xs tracking-widest">{title}</h4>
        <p className="text-[10px] text-slate-500 font-mono mt-1 max-w-[150px]">{desc}</p>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);

  const bootLogs = [
    "ATTACHING TO HYPERVISOR...",
    "ISOLATING MALICIOUS RUNTIMES...",
    "DECRYPTING FORENSIC DATABASE...",
    "VERIFYING ENCLAVE INTEGRITY...",
    "ESTABLISHING NEURAL LINK...",
    "ACCESS GRANTED: ANIKET PALSODKAR"
  ];

  useEffect(() => {
    if (bootStep < bootLogs.length) {
      const timeout = setTimeout(() => setBootStep(s => s + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setBooting(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [bootStep]);

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(scrollYProgress, [0, 0.2], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <>
      <AnimatePresence>
        {booting && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] } as const}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono p-6"
          >
            <div className="max-w-2xl w-full">
              <div className="mb-12 flex justify-between items-center border-b border-red-900/30 pb-4">
                <span className="text-red-600 font-black tracking-[0.5em] text-xs uppercase animate-pulse">PhishGuard Core Init</span>
                <span className="text-red-900 text-[10px] uppercase">v4.0.9-Stable</span>
              </div>
              
              <div className="space-y-4">
                {bootLogs.slice(0, bootStep + 1).map((log, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <span className="text-red-900 text-xs">[{i+1}]</span>
                    <span className={`text-sm md:text-lg font-bold tracking-widest ${i === bootStep ? 'text-red-500' : 'text-red-800'}`}>
                      {i === bootStep ? <DecryptText text={log} /> : log}
                    </span>
                    {i < bootStep && <span className="text-emerald-500 text-xs ml-auto">[OK]</span>}
                  </div>
                ))}
              </div>

              {bootStep < bootLogs.length && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: bootLogs.length * 0.6, ease: "linear" }}
                  className="h-1 bg-red-600 mt-12 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                />
              )}
            </div>

            {/* Matrix rain-like subtle background during boot */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden text-[10px] leading-none text-red-600 font-mono select-none">
               {Array.from({length: 20}).map((_, i) => (
                 <div key={i} className="absolute" style={{left: `${i*5}%`, top: '-10%', animation: `fall ${Math.random()*10+5}s linear infinite`, animationDelay: `${Math.random()*5}s`}}>
                   {Array.from({length: 50}).map((_, j) => <div key={j}>{randomChar()}</div>)}
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-transparent relative z-10 overflow-x-hidden">
        
        {/* SVG Glitch Filter Definition */}
        <svg className="hidden">
          <defs>
            <filter id="glitch">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
            </filter>
          </defs>
        </svg>

        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-red-600 transform origin-left z-50 shadow-[0_0_15px_#ef4444]" style={{ scaleX }} />

        {/* ─── HERO SECTION ─── */}
        <motion.section style={{ y: heroY, opacity: heroOpacity }} className="h-screen flex flex-col items-center justify-center relative px-6">
          
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" } as const}
            className="absolute top-[20%] left-[20%] p-6 cyber-panel glass-panel border-red-500/30 opacity-60"
          >
            <ShieldCheck className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_#ef4444]" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [0, -10, 10, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 } as const}
            className="absolute bottom-[20%] right-[20%] p-6 cyber-panel-alt glass-panel border-red-500/30 opacity-60"
          >
            <Lock className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_#ef4444]" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 cyber-button border border-red-500/30 bg-red-500/10 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-400">Deep-Core Heuristic Engine Active</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-400 to-slate-800 drop-shadow-2xl hover:filter hover:url(#glitch) transition-all duration-300">
              PhishGuard <span className="text-red-600 drop-shadow-[0_0_20px_#ef4444]">AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-light uppercase tracking-widest text-xs">
              Autonomous Network Interrogation Framework // Decrypting Hostile Architecture in Real-Time
            </p>

            <MagneticButton 
              onClick={() => router.push('/login')}
              className="group relative inline-flex items-center gap-4 px-12 py-6 bg-red-700 hover:bg-red-600 cyber-button font-black text-xl tracking-[0.3em] uppercase transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] overflow-hidden"
            >
              <span className="relative z-10">ACCESS SYSTEM</span>
              <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
            </MagneticButton>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-600">Scan Infrastructure</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-red-600 to-transparent" />
          </div>
        </motion.section>

        {/* ─── TECHNICAL ARCHITECTURE SECTION ─── */}
        <section className="min-h-screen relative py-32 px-6 flex items-center">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-200px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-[10px] font-black text-red-600 tracking-[0.4em] uppercase mb-4 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" /> Forensics Layer
                </h2>
                <h3 className="text-6xl font-black mb-6 leading-tight uppercase tracking-tighter">
                  Active Network <br />
                  <span className="text-slate-600">Interrogation</span>
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-mono uppercase">
                  Legacy systems fail because they are reactive. PhishGuard AI is an aggressive interrogator. It establishes high-entropy links to verify SSL chains, WHOIS latency, and DNS-layer anomalies before a single packet reaches your perimeter.
                </p>
                
                <ul className="space-y-6 mt-10">
                  {[
                    { title: "DNS Layer Binding", desc: "Resolves A/AAAA records to detect malicious IP hosting clusters." },
                    { title: "TLS Certificate Inspection", desc: "Validates X.509 cert chains, flagging suspicious Let's Encrypt usage." },
                    { title: "WHOIS Registry Query", desc: "Checks domain age; heavily penalizing domains registered within 30 days." }
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.2 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 p-1 bg-red-600/20 cyber-button border border-red-600/50">
                        <div className="w-2 h-2 bg-red-500" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-200 text-xs uppercase tracking-widest">{item.title}</h4>
                        <p className="text-[10px] text-slate-600 mt-1 uppercase font-mono">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <div className="relative h-[600px] w-full hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 cyber-panel glass-panel border-2 border-red-600/50 shadow-[0_0_40px_rgba(220,38,38,0.2)] z-20">
                <Cpu className="w-16 h-16 text-red-600" />
              </div>

              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-20">
                 <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#dc2626" strokeWidth="2" strokeDasharray="10,5" />
                 <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#dc2626" strokeWidth="2" strokeDasharray="10,5" />
                 <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#dc2626" strokeWidth="2" strokeDasharray="10,5" />
              </svg>

              <TechNode icon={Globe} title="DNS Resolver" desc="Extracts raw IPv4/IPv6 bindings." delay={0.2} x="10%" y="10%" />
              <TechNode icon={Lock} title="TLS Handshake" desc="Extracts issuer & expiry telemetry." delay={0.4} x="70%" y="20%" />
              <TechNode icon={Eye} title="DOM Scraper" desc="Hunts for <input type='password'>." delay={0.6} x="40%" y="75%" />
            </div>

          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-600/5 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[100px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="relative z-10"
          >
            <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter">Secure Your Perimeter</h2>
            <MagneticButton 
              onClick={() => router.push('/login')}
              className="px-16 py-6 bg-red-600 text-white cyber-button font-black text-xl tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] transition-all"
            >
              LAUNCH DASHBOARD
            </MagneticButton>
          </motion.div>
        </section>

        <style jsx global>{`
          @keyframes fall {
            from { transform: translateY(-100%); }
            to { transform: translateY(1000%); }
          }
        `}</style>
      </div>
    </>
  );
}
