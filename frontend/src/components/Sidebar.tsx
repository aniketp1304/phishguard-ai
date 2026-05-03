'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  History, 
  Wrench, 
  LogOut, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'URL Scanner', href: '/scanner', icon: ShieldAlert },
  { name: 'Scan Logs', href: '/logs', icon: History },
  { name: 'Security Tools', href: '/tools', icon: Wrench },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on landing and login pages
  if (pathname === '/' || pathname === '/login') return null;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-red-900/20 bg-black flex flex-col z-50">
      <div className="p-8 flex items-center gap-3 border-b border-red-900/10">
        <div className="bg-red-950/30 p-2 cyber-panel border border-red-900/30">
          <ShieldCheck className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-xl font-black text-red-600 tracking-tighter uppercase drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
            PHISHGUARD
          </h1>
          <span className="text-[10px] text-red-900 tracking-[0.3em] font-black uppercase">AI CORE</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 cyber-button transition-all duration-300 relative group ${
                isActive
                  ? 'bg-red-900/20 text-red-500 border border-red-600/30 shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                  : 'text-slate-600 hover:text-red-400'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 top-0 w-1 h-full bg-red-600 shadow-[0_0_10px_#dc2626]" 
                />
              )}
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-red-600' : ''}`} />
              <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-red-900/10">
        <div className="mb-4 px-4 py-2 bg-red-950/10 border border-red-900/20 rounded-none flex items-center gap-2">
           <Activity className="w-3 h-3 text-red-600 animate-pulse" />
           <span className="text-[9px] text-red-900 font-black tracking-widest uppercase">System Online</span>
        </div>
        <Link 
          href="/login"
          className="flex items-center gap-3 px-4 py-3 cyber-button text-slate-600 hover:text-red-600 transition-colors uppercase font-black text-[10px] tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </Link>
      </div>
    </aside>
  );
}
