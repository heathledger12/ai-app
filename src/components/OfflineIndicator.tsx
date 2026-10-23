import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface OfflineIndicatorProps {
  language: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();
  const t = translations[language];

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 text-slate-950 px-4 py-2 text-xs font-semibold shadow-xl backdrop-blur-md border border-amber-300/40 animate-pulse">
      <WifiOff className="h-4 w-4" />
      <span>{t.offlineMsg}</span>
    </div>
  );
};
