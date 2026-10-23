import React, { useState } from 'react';
import {
  MessageSquare,
  LayoutDashboard,
  PenTool,
  Languages,
  Code2,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Image as ImageIcon,
  Video as VideoIcon,
  Smartphone,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { Conversation, Language, ToolType } from '../types';
import { translations } from '../utils/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAllConversations: () => void;
  onExportConversation?: (convo: Conversation) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  language,
  activeTool,
  onSelectTool,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onClearAllConversations,
  onExportConversation,
  onOpenSettings,
}) => {
  const t = translations[language];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const navItems = [
    { id: 'chat' as ToolType, label: language === 'ta' ? 'AI உரையாடல்' : 'AI Chat', icon: MessageSquare },
    { id: 'dashboard' as ToolType, label: t.dashboard, icon: LayoutDashboard },
    { id: 'writing' as ToolType, label: t.writingAssistant, icon: PenTool },
    { id: 'translation' as ToolType, label: t.translation, icon: Languages },
    { id: 'coding' as ToolType, label: t.codingHelp, icon: Code2 },
    { id: 'study' as ToolType, label: t.studyAssistant, icon: GraduationCap },
    { id: 'ideas' as ToolType, label: t.ideaGenerator, icon: Lightbulb },
    { id: 'business' as ToolType, label: t.businessCreator, icon: TrendingUp },
    { id: 'image' as ToolType, label: t.imageGen, icon: ImageIcon },
    { id: 'video' as ToolType, label: t.videoGen, icon: VideoIcon },
    { id: 'downloads' as ToolType, label: t.myDownloads, icon: Download },
    { id: 'android-app' as ToolType, label: t.downloadAndroidApp, icon: Smartphone },
  ];

  const handleStartRename = (convo: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(convo.id);
    setEditingTitle(convo.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      onDeleteConversation(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 4000);
    }
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b border-slate-800/80">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 transition active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{t.newChat}</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Smart Tools section */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              {t.tools}
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTool === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTool(item.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Chat History section */}
          <div>
            <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              <span>{t.chatHistory}</span>
              {conversations.length > 0 && (
                <button
                  onClick={onClearAllConversations}
                  title={t.clearHistory}
                  className="text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              {conversations.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-slate-500 italic">
                  {t.noChatsYet}
                </div>
              ) : (
                conversations.map((convo) => {
                  const isActive = activeTool === 'chat' && activeConversationId === convo.id;
                  const isEditing = editingId === convo.id;

                  return (
                    <div
                      key={convo.id}
                      onClick={() => {
                        onSelectTool('chat');
                        onSelectConversation(convo.id);
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30 font-medium'
                          : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex w-full items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(convo.id, e as any);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="w-full rounded bg-slate-950 px-2 py-1 text-xs text-white outline-none border border-indigo-500"
                          />
                          <button
                            onClick={(e) => handleSaveRename(convo.id, e)}
                            className="p-1 text-emerald-400 hover:bg-slate-700 rounded"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="p-1 text-slate-400 hover:bg-slate-700 rounded"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-indigo-400" />
                            <span className="truncate">{convo.title}</span>
                          </div>

                          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            {/* Download chat history button */}
                            {onExportConversation && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onExportConversation(convo);
                                }}
                                title={t.downloadChat}
                                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-indigo-300 transition"
                              >
                                <Download className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleStartRename(convo, e)}
                              title={t.rename}
                              className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(convo.id, e)}
                              title={confirmDeleteId === convo.id ? t.deleteConfirm : t.delete}
                              className={`rounded p-1 transition ${
                                confirmDeleteId === convo.id
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'text-slate-400 hover:bg-slate-700 hover:text-rose-400'
                              }`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Local Storage Privacy note */}
        <div className="border-t border-slate-800/80 p-3 bg-slate-950/60">
          <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-tight">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{t.localDataNote}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
