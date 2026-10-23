import React, { useState } from 'react';
import {
  X,
  Languages,
  Moon,
  Sun,
  Trash2,
  ShieldCheck,
  Activity,
  Cpu,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ApiStatus, Language, Theme } from '../types';
import { translations } from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  apiStatus: ApiStatus | null;
  onClearAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  apiStatus,
  onClearAllData,
}) => {
  const t = translations[language];
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    if (confirmClear) {
      onClearAllData();
      setConfirmClear(false);
      onClose();
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <h2 className="text-base font-bold text-white">{t.settings}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-6">
          {/* Language Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
              <Languages className="h-3.5 w-3.5 text-indigo-400" />
              <span>{t.languageSelect}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onLanguageChange('ta')}
                className={`flex items-center justify-between rounded-2xl p-3 border text-xs font-semibold transition cursor-pointer ${
                  language === 'ta'
                    ? 'border-indigo-500 bg-indigo-600/15 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>தமிழ் (Tamil)</span>
                {language === 'ta' && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`flex items-center justify-between rounded-2xl p-3 border text-xs font-semibold transition cursor-pointer ${
                  language === 'en'
                    ? 'border-indigo-500 bg-indigo-600/15 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>English</span>
                {language === 'en' && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Theme Appearance */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-3.5 w-3.5 text-purple-400" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
              <span>{t.themeToggle}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (theme !== 'dark') onThemeToggle();
                }}
                className={`flex items-center justify-between rounded-2xl p-3 border text-xs font-semibold transition cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-600/15 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-purple-400" />
                  <span>{t.darkMode}</span>
                </div>
                {theme === 'dark' && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
              </button>
              <button
                onClick={() => {
                  if (theme !== 'light') onThemeToggle();
                }}
                className={`flex items-center justify-between rounded-2xl p-3 border text-xs font-semibold transition cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-500 bg-indigo-600/15 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>{t.lightMode}</span>
                </div>
                {theme === 'light' && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* API Configuration Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span>{t.apiStatus}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  apiStatus?.hasApiKey
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${apiStatus?.hasApiKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {apiStatus?.hasApiKey ? 'Active' : 'Unconfigured'}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed space-y-1">
              <div>
                <strong className="text-slate-300">Model:</strong> {apiStatus?.activeModel || 'gemini-3.8-flash'}
              </div>
              <div>
                <strong className="text-slate-300">Security Architecture:</strong> Server-side API proxy (zero client key exposure).
              </div>
            </div>
          </div>

          {/* Privacy & Storage */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{t.privacyTitle}</span>
            </label>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {t.privacyText}
            </p>

            <button
              onClick={handleClear}
              className={`flex items-center justify-center gap-2 w-full rounded-2xl py-2.5 text-xs font-semibold transition cursor-pointer ${
                confirmClear
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{confirmClear ? (language === 'ta' ? 'உறுதி செய்க: அனைத்தையும் நீக்க தட்டவும்' : 'Click again to confirm delete') : t.clearHistory}</span>
            </button>
          </div>

          {/* PWA & Mobile Info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200 block mb-0.5">
                {language === 'ta' ? 'கைபேசி செயலி (PWA) பயன்முறை' : 'Installable Mobile Web App'}
              </strong>
              {language === 'ta'
                ? 'இந்த செயலி முழுமையாக PWA ஆதரவு கொண்டது. உங்கள் மொபைல் முகப்புத் திரையில் நிறுவி பயன்படுத்தலாம்.'
                : 'SmartAI Tamil works seamlessly as an installable standalone Progressive Web App across Android, iOS, and Desktop.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/60 px-6 py-3.5 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-mono">SmartAI Tamil v2.0</div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
