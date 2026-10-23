import React, { useState, useEffect } from 'react';
import {
  Download,
  Trash2,
  Eye,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  MessageSquare,
  FileCode,
  FileCheck,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import { DownloadRecord, Language, ToolType } from '../types';
import { translations } from '../utils/translations';
import {
  getStoredDownloads,
  deleteStoredDownload,
  clearStoredDownloads,
  downloadTextFile,
  downloadImageFile,
  downloadVideoFile,
} from '../utils/download';

interface MyDownloadsViewProps {
  language: Language;
  onNavigateToTool: (tool: ToolType) => void;
}

export const MyDownloadsView: React.FC<MyDownloadsViewProps> = ({
  language,
  onNavigateToTool,
}) => {
  const t = translations[language];
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'document' | 'chat'>('all');
  const [previewItem, setPreviewItem] = useState<DownloadRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const loadDownloads = () => {
    setDownloads(getStoredDownloads());
  };

  useEffect(() => {
    loadDownloads();

    const handleUpdate = () => loadDownloads();
    window.addEventListener('smartai:downloads_updated', handleUpdate);
    window.addEventListener('smartai:download_added', handleUpdate);

    return () => {
      window.removeEventListener('smartai:downloads_updated', handleUpdate);
      window.removeEventListener('smartai:download_added', handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteStoredDownload(id);
    showToast(language === 'ta' ? 'பட்டியலிலிருந்து நீக்கப்பட்டது' : 'Item removed from list');
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearStoredDownloads();
      setConfirmClear(false);
      showToast(language === 'ta' ? 'வரலாறு நீக்கப்பட்டது' : 'History cleared');
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  const handleDownloadAgain = async (item: DownloadRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'text' || item.type === 'chat' || item.type === 'document') {
      if (item.content) {
        downloadTextFile(item.content, item.name);
        showToast(t.downloadSuccess);
      }
    } else if (item.type === 'image' && item.url) {
      const ext = item.format === 'jpg' ? 'jpeg' : (item.format as any) || 'png';
      await downloadImageFile(item.url, item.name.replace(/\.[^.]+$/, ''), ext);
      showToast(t.downloadSuccess);
    } else if (item.type === 'video' && item.url) {
      await downloadVideoFile(item.url, item.name.replace(/\.[^.]+$/, ''), (item.format as any) || 'mp4');
      showToast(t.downloadSuccess);
    }
  };

  const filteredDownloads = downloads.filter((d) => {
    if (activeFilter === 'all') return true;
    return d.type === activeFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4 text-pink-400" />;
      case 'video':
        return <VideoIcon className="h-4 w-4 text-purple-400" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-emerald-400" />;
      case 'document':
        return <FileText className="h-4 w-4 text-blue-400" />;
      default:
        return <FileCode className="h-4 w-4 text-indigo-400" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case 'video':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'chat':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'document':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="relative flex-1 overflow-y-auto px-3 sm:px-8 py-6 max-w-6xl mx-auto w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600/95 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md border border-emerald-400/40 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Download className="h-6 w-6 text-indigo-400" />
            <span>{t.myDownloads}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {language === 'ta'
              ? 'நீங்கள் உருவாக்கிய படங்கள், வீடியோக்கள், ஆவணங்கள் மற்றும் உரையாடல்களின் பதிவிறக்க வரலாறு.'
              : 'Access and re-download all media, documents, and chat transcripts generated in this session.'}
          </p>
        </div>

        {downloads.length > 0 && (
          <button
            onClick={handleClearAll}
            className={`flex items-center gap-1.5 self-start sm:self-auto rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              confirmClear
                ? 'bg-rose-600 text-white'
                : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400'
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{confirmClear ? (language === 'ta' ? 'உறுதி செய்க' : 'Confirm Clear') : t.clearDownloads}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'all', label: t.filterAll },
          { id: 'image', label: t.filterImages },
          { id: 'video', label: t.filterVideos },
          { id: 'document', label: t.filterDocs },
          { id: 'chat', label: t.filterChats },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List or Empty State */}
      {filteredDownloads.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800/80 text-slate-500 mb-4">
            <HardDrive className="h-8 w-8 stroke-1" />
          </div>
          <h3 className="text-base font-bold text-white">{t.noDownloadsYet}</h3>
          <p className="mt-1.5 max-w-md text-xs text-slate-400 leading-relaxed">
            {language === 'ta'
              ? 'உரையாடல், எழுத்து, பட உருவாக்கம் அல்லது வீடியோ ஸ்டுடியோவில் நீங்கள் பதிவிறக்கும் அனைத்து உள்ளடக்கங்களும் இங்கு பட்டியலிடப்படும்.'
              : 'Any chat transcripts, AI writing documents, generated images, or videos you download will be listed here for quick retrieval.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={() => onNavigateToTool('chat')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition cursor-pointer"
            >
              <span>{language === 'ta' ? 'அரட்டையைத் தொடங்கு' : 'Start AI Chat'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTool('image')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5 text-pink-400" />
              <span>{language === 'ta' ? 'படம் உருவாக்கு' : 'Generate Images'}</span>
            </button>
            <button
              onClick={() => onNavigateToTool('video')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              <VideoIcon className="h-3.5 w-3.5 text-purple-400" />
              <span>{language === 'ta' ? 'வீடியோ ஸ்டுடியோ' : 'Video Studio'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDownloads.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg hover:border-indigo-500/40 hover:bg-slate-900 transition"
            >
              <div>
                {/* Header with Type & Format */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-slate-950 p-1.5 border border-slate-800">
                      {getTypeIcon(item.type)}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getTypeBadgeClass(
                        item.type
                      )}`}
                    >
                      {item.format}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.size || 'Saved'}
                  </span>
                </div>

                {/* Thumbnail if available */}
                {item.thumbnail && (
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="mb-3 relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer group-hover:border-indigo-500/40"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                )}

                {/* Title & Timestamp */}
                <h3 className="text-xs font-bold text-white line-clamp-2 leading-relaxed mb-1">
                  {item.name}
                </h3>
                <div className="text-[10px] text-slate-500">
                  {new Date(item.timestamp).toLocaleString(language === 'ta' ? 'ta-IN' : 'en-US', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t.openPreview}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDownloadAgain(item, e)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white px-2.5 py-1 text-xs font-semibold transition cursor-pointer"
                    title={t.downloadAgain}
                  >
                    <Download className="h-3 w-3" />
                    <span>{language === 'ta' ? 'மீண்டும் சேமி' : 'Save'}</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informative storage notice */}
      <div className="mt-8 rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
        <HardDrive className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>
          {language === 'ta'
            ? 'பதிவிறக்க வரலாறு உங்கள் உலாவியில் மட்டுமே பாதுகாப்பாக சேமிக்கப்படுகிறது. பதிவிறக்கம் செய்யப்பட்ட உண்மையான கோப்புகள் உங்கள் சாதனத்தின் Downloads கோப்புறையில் உள்ளன.'
            : 'Download history is indexed locally within this browser session. The physical files are saved directly in your device’s Downloads directory.'}
        </span>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 p-5 shadow-2xl flex flex-col text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 truncate pr-2">
                {getTypeIcon(previewItem.type)}
                <span className="font-bold text-sm text-white truncate">{previewItem.name}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto py-4">
              {previewItem.type === 'image' && previewItem.url && (
                <div className="flex justify-center">
                  <img
                    src={previewItem.url}
                    alt={previewItem.name}
                    className="max-h-[60vh] w-auto rounded-xl object-contain shadow-lg"
                  />
                </div>
              )}

              {previewItem.type === 'video' && previewItem.url && (
                <div className="flex justify-center">
                  <video
                    src={previewItem.url}
                    controls
                    autoPlay
                    className="max-h-[60vh] w-auto rounded-xl shadow-lg bg-black"
                  />
                </div>
              )}

              {(previewItem.type === 'text' || previewItem.type === 'chat' || previewItem.type === 'document') && (
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[55vh]">
                  {previewItem.content || 'Content preview not available.'}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">{previewItem.size || 'Ready'}</span>
              <button
                onClick={(e) => handleDownloadAgain(previewItem, e)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t.downloadAgain}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
