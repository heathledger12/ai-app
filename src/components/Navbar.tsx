import React from 'react';
import { Menu, Sparkles, Sun, Moon, Settings, Languages, Activity } from 'lucide-react';
import { Language, Theme, ToolType, ApiStatus } from '../types';
import { translations } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  activeTool: ToolType;
  apiStatus: ApiStatus | null;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  activeTool,
  apiStatus,
  onOpenSettings,
  onToggleSidebar,
}) => {
  const t = translations[language];

  const getToolTitle = () => {
    switch (activeTool) {
      case 'chat':
        return language === 'ta' ? 'AI உரையாடல்' : 'AI Chat';
      case 'dashboard':
        return t.dashboard;
      case 'writing':
        return t.writingAssistant;
      case 'translation':
        return t.translation;
      case 'coding':
        return t.codingHelp;
      case 'study':
        return t.studyAssistant;
      case 'ideas':
        return t.ideaGenerator;
      case 'business':
        return t.businessCreator;
      case 'image':
        return t.imageGen;
      default:
        return t.appName;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-3 sm:px-6 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/80 light:border-slate-200 light:bg-white/80">
      {/* Left: Sidebar toggle & Brand info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-300 hover:bg-slate-800/80 hover:text-white transition md:hidden cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white dark:text-white light:text-slate-900">
                {t.appName}
              </span>
              <span className="hidden md:inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                v2.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              {getToolTitle()}
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Language, Theme, API Status, PWA Install, Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* API Health Pill */}
        <div
          onClick={onOpenSettings}
          title={apiStatus?.hasApiKey ? t.apiKeyConfigured : t.apiKeyMissing}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs cursor-pointer hover:border-slate-700 transition"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              apiStatus?.hasApiKey ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-[11px] font-medium text-slate-300 hidden md:inline">
            {apiStatus?.hasApiKey ? 'Gemini 3.8' : 'Config'}
          </span>
        </div>

        {/* PWA Install Button */}
        <PWAInstallButton language={language} />

        {/* Language Switcher */}
        <button
          onClick={() => onLanguageChange(language === 'ta' ? 'en' : 'ta')}
          className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-indigo-500/40 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          title={t.languageSelect}
        >
          <Languages className="h-3.5 w-3.5 text-indigo-400" />
          <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={onThemeToggle}
          className="rounded-xl border border-slate-800 bg-slate-900/90 p-2 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer"
          title={theme === 'dark' ? t.lightMode : t.darkMode}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="rounded-xl border border-slate-800 bg-slate-900/90 p-2 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer"
          title={t.settings}
          aria-label="Settings"
        >
          <Settings className="h-4 w-4 text-slate-300 hover:rotate-45 transition-transform" />
        </button>
      </div>
    </header>
  );
};
