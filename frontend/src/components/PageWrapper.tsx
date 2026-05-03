'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Fingerprint, Terminal } from 'lucide-react';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || pathname === '/login';

  return (
    <main className={`flex-1 min-h-screen relative z-10 flex flex-col transition-all duration-300 ${isPublicPage ? 'ml-0' : 'ml-0 md:ml-64'}`}>
      <div className="flex-1">
        {children}
      </div>
      
      {/* ELITE FORENSIC FOOTER */}
      <footer className="w-full py-12 mt-20 relative z-20 border-t border-red-900/10 bg-black">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
          
          <div className="flex items-center gap-6 mb-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-red-900" />
            <Fingerprint className="w-5 h-5 text-red-900" />
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-red-900" />
          </div>

          <div className="relative group cursor-crosshair">
            {/* Background "Ghost" text for depth without overlapping mess */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="text-4xl font-black text-red-600 uppercase tracking-[0.5em] whitespace-nowrap">
                Aniket Palsodkar
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-1 bg-red-600 animate-ping" />
                <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.5em]">
                  Designed and Created by
                </span>
              </div>
              <span className="text-[10px] font-black text-red-900 uppercase tracking-[0.6em] mb-4">
                Lead System Architect
              </span>
              
              <div className="relative overflow-hidden px-10 py-4 border border-red-900/20 cyber-panel bg-red-950/5">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-600" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-600" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600" />

                <motion.span 
                  whileHover={{ letterSpacing: '0.4em' }}
                  className="text-2xl md:text-3xl font-black text-slate-200 tracking-[0.2em] uppercase font-mono transition-all duration-500"
                >
                  Aniket Palsodkar
                </motion.span>
                
                {/* Horizontal Scanning Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[1px] bg-red-600/30 shadow-[0_0_10px_#dc2626] z-10"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 text-[9px] font-black text-red-950 uppercase tracking-[0.3em]">
             <Terminal className="w-3 h-3" />
             <span>Build v4.0.9 // Forensic Grade Interrogator</span>
             <span className="w-1 h-1 rounded-full bg-red-900 animate-pulse" />
             <span>All Rights Reserved</span>
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
      </footer>
    </main>
  );
}
