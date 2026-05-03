'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/context/NotificationContext';

export default function FloatingNotification() {
  const { notification } = useNotification();

  return (
    <div className="fixed top-6 right-6 z-[100] pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`glass-panel p-4 rounded-xl flex items-center gap-4 shadow-2xl min-w-[300px] max-w-[400px] border-l-4 ${
              notification.color === 'red' ? 'border-l-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] bg-red-950/40' :
              notification.color === 'emerald' ? 'border-l-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-950/40' :
              notification.color === 'amber' ? 'border-l-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-950/40' :
              'border-l-slate-500 shadow-[0_0_20px_rgba(100,116,139,0.3)] bg-slate-900/40'
            }`}
          >
            <div className={`p-2 rounded-lg bg-${notification.color}-900/40 border border-${notification.color}-500/20`}>
              <notification.icon className={`w-6 h-6 text-${notification.color}-500 ${notification.color === 'red' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                {notification.type === 'alert' ? 'Threat Intercept' : 'System Notice'}
              </p>
              <p className="text-sm font-medium text-slate-200">
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
