import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface PWAInstallButtonProps {
  language: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const t = translations[language];

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-pink-500 transition active:scale-95 cursor-pointer"
        title={t.installApp}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t.installApp}</span>
        <span className="sm:hidden">PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition cursor-pointer"
          title={t.installAppIos}
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">{t.installAppIos}</span>
          <span className="sm:hidden">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold text-white">
                  {language === 'ta' ? 'iPhone / iPad-ல் நிறுவுதல்' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 shrink-0">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <p>
                    {language === 'ta'
                      ? '1. Safari உலாவி கீழே உள்ள Share பொத்தானைத் தட்டவும்.'
                      : '1. Tap the Share button in the Safari bottom toolbar.'}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-pink-500/10 p-2 text-pink-400 shrink-0">
                    <PlusSquare className="h-5 w-5" />
                  </div>
                  <p>
                    {language === 'ta'
                      ? '2. கீழே உருட்டி "Add to Home Screen" (முகப்புத் திரையில் சேர்) என்பதைத் தட்டவும்.'
                      : '2. Scroll down and tap "Add to Home Screen".'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
