'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

type NotificationColor = 'red' | 'emerald' | 'amber' | 'slate';
type NotificationType = 'alert' | 'safe' | 'info';

export interface NotificationPayload {
  id: string;
  type: NotificationType;
  message: string;
  icon: any; // LucideIcon
  color: NotificationColor;
}

interface NotificationContextType {
  notification: NotificationPayload | null;
  addNotification: (payload: Omit<NotificationPayload, 'id'>) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  const addNotification = (payload: Omit<NotificationPayload, 'id'>) => {
    const newNotif = { ...payload, id: Math.random().toString(36).substring(7) };
    setNotification(newNotif);
    
    // Auto clear after 5 seconds
    setTimeout(() => {
      setNotification((current) => current?.id === newNotif.id ? null : current);
    }, 5000);
  };

  const clearNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ notification, addNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
