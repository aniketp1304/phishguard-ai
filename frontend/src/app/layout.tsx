import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import CustomCursor from '@/components/CustomCursor';
import PageWrapper from '@/components/PageWrapper';
import FloatingNotification from '@/components/FloatingNotification';
import { NotificationProvider } from '@/context/NotificationContext';
import NetworkBackground from '@/components/NetworkBackground';

export const metadata: Metadata = {
  title: 'PhishGuard AI',
  description: 'Advanced phishing detection and analysis platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-slate-300 antialiased flex cursor-none relative overflow-x-hidden font-mono">
        <NotificationProvider>
          {/* Gritty Horror Background Elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <NetworkBackground />
            {/* Deep static noise */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]" />
            {/* Blood red and stark white ominous glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-900/10 blur-[150px] animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-950/5 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-red-800/10 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          </div>

          <FloatingNotification />
          <CustomCursor />
          <div className="relative z-20">
            <Sidebar />
          </div>
          <PageWrapper>
            {children}
          </PageWrapper>
        </NotificationProvider>
      </body>
    </html>
  );
}
