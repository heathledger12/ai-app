import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  FileText,
  Code,
  BookOpen,
  ArrowRight,
  Download,
  FileDown,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { translations } from '../utils/translations';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { downloadTextFile, exportConversationAsText, getFormattedTimestamp } from '../utils/download';

interface ChatViewProps {
  language: Language;
  messages: ChatMessage[];
  isLoading: boolean;
  conversationTitle?: string;
  onSendMessage: (text: string) => void;
  onRetryMessage: (messageIndex: number) => void;
  onSelectPrompt: (promptText: string) => void;
  onExportChat?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  language,
  messages,
  isLoading,
  conversationTitle,
  onSendMessage,
  onRetryMessage,
  onSelectPrompt,
  onExportChat,
}) => {
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [activeSpeechMessageId, setActiveSpeechMessageId] = useState<string | null>(null);
  const [speechErrorMsg, setSpeechErrorMsg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll down smoothly on new messages or loading state
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Voice recognition hook
  const { isListening, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition({
    language,
    onResult: (transcript) => {
      setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    },
    onError: (err) => {
      if (err === 'not-allowed') {
        setSpeechErrorMsg(t.micPermissionDenied);
      } else if (err === 'not-supported') {
        setSpeechErrorMsg(t.speechNotSupported);
      } else {
        setSpeechErrorMsg(`குரல் அறிதல் பிழை: ${err}`);
      }
      setTimeout(() => setSpeechErrorMsg(null), 5000);
    },
  });

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setSpeechErrorMsg(null);
      startListening();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (isListening) stopListening();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download individual assistant response as .txt
  const handleDownloadResponse = (id: string, text: string) => {
    if (downloadedId === id) return; // Prevent duplicate clicks
    const timestamp = getFormattedTimestamp();
    const filename = `smartai-response-${timestamp}.txt`;
    const success = downloadTextFile(text, filename);
    if (success) {
      setDownloadedId(id);
      showToast(t.downloadSuccess);
      setTimeout(() => setDownloadedId(null), 2500);
    } else {
      showToast(t.downloadFailed);
    }
  };

  // Export entire conversation as .txt
  const handleExportFullChat = () => {
    if (messages.length === 0) return;
    if (onExportChat) {
      onExportChat();
      showToast(t.downloadSuccess);
    } else {
      const success = exportConversationAsText(
        conversationTitle || (language === 'ta' ? 'உரையாடல்' : 'Conversation'),
        messages,
        language
      );
      if (success) {
        showToast(t.downloadSuccess);
      } else {
        showToast(t.downloadFailed);
      }
    }
  };

  // Text-To-Speech (Read Aloud)
  const handleToggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechMessageId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeechMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => setActiveSpeechMessageId(null);
    utterance.onerror = () => setActiveSpeechMessageId(null);

    setActiveSpeechMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const sampleSuggestions = [
    { text: t.promptLetter, icon: FileText, tag: 'Writing' },
    { text: t.promptTamilCode, icon: Code, tag: 'Coding' },
    { text: t.promptTranslate, icon: BookOpen, tag: 'Translation' },
    { text: t.promptStudy, icon: Sparkles, tag: 'Learning' },
  ];

  return (
    <div className="relative flex flex-1 flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-2 sm:px-6 py-3">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600/95 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md border border-emerald-400/40 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar when messages exist */}
      {messages.length > 0 && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="truncate font-medium text-slate-300">
              {conversationTitle || (language === 'ta' ? 'செயலில் உள்ள உரையாடல்' : 'Active Conversation')}
            </span>
          </div>

          <button
            onClick={handleExportFullChat}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white px-3 py-1 text-xs font-medium transition cursor-pointer active:scale-95"
            title={t.exportChatTooltip}
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>{t.downloadChat}</span>
          </button>
        </div>
      )}

      {/* Speech Error Banner if any */}
      {speechErrorMsg && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{speechErrorMsg}</span>
        </div>
      )}

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {messages.length === 0 ? (
          // Empty State with Greetings & Suggestions
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/25">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.emptyChatHeading}
            </h2>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-400">
              {t.emptyChatSubheading}
            </p>

            {/* Quick Prompt Cards */}
            <div className="mt-8 w-full max-w-2xl text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
                {t.suggestionsTitle}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sampleSuggestions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectPrompt(item.text)}
                      className="group flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-left transition hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
                    >
                      <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-slate-200 group-hover:text-white transition line-clamp-2">
                          {item.text}
                        </span>
                        <div className="mt-1 flex items-center text-[10px] text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition">
                          <span>{language === 'ta' ? 'அனுப்ப தட்டவும்' : 'Click to send'}</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Active Messages List
          messages.map((message, index) => {
            const isUser = message.role === 'user';
            const isSpeaking = activeSpeechMessageId === message.id;
            const isDownloaded = downloadedId === message.id;

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm mt-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                      : 'border border-slate-800 bg-slate-900/90 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {/* Message Content */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  ) : (
                    <MarkdownRenderer content={message.content} />
                  )}

                  {/* Error state alert */}
                  {message.status === 'error' && (
                    <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-rose-500/15 p-2 text-xs text-rose-300 border border-rose-500/30">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{message.errorMessage || 'Error generating response.'}</span>
                    </div>
                  )}

                  {/* Footer actions for assistant response */}
                  {!isUser && (
                    <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400 gap-1.5">
                      <span className="text-[10px] text-slate-400">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <div className="flex flex-wrap items-center gap-1">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white transition active:scale-95"
                          title={t.copy}
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span className="hidden sm:inline">{t.copy}</span>
                            </>
                          )}
                        </button>

                        {/* Download response button */}
                        <button
                          onClick={() => handleDownloadResponse(message.id, message.content)}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-indigo-300 transition active:scale-95"
                          title={t.downloadResponse}
                        >
                          {isDownloaded ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">{t.downloadSuccess}</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-3 w-3 text-indigo-400" />
                              <span className="hidden sm:inline">{language === 'ta' ? 'பதிவிறக்கு' : 'Download'}</span>
                            </>
                          )}
                        </button>

                        {/* Read aloud TTS button */}
                        <button
                          onClick={() => handleToggleSpeech(message.id, message.content)}
                          className={`flex items-center gap-1 rounded-md px-2 py-1 transition ${
                            isSpeaking
                              ? 'bg-indigo-500/20 text-indigo-400 animate-pulse'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                          title={isSpeaking ? t.stopAudio : t.readAloud}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="h-3 w-3 text-indigo-400" />
                              <span className="hidden sm:inline">{t.stopAudio}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3" />
                              <span className="hidden sm:inline">{t.readAloud}</span>
                            </>
                          )}
                        </button>

                        {/* Retry button */}
                        <button
                          onClick={() => onRetryMessage(index)}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                          title={t.retry}
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span className="hidden sm:inline">{t.retry}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm mt-1">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-none border border-slate-800 bg-slate-900/90 px-4 py-3.5 shadow-md flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 rounded-full bg-pink-500 animate-bounce" />
              </div>
              <span className="text-xs text-slate-300 font-medium">{t.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Section */}
      <div className="mt-2 pt-2 border-t border-slate-800/80">
        <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-xl focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? t.voiceListening : t.typePlaceholder}
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 px-1">
            <div className="flex items-center gap-2">
              {/* Voice recognition button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={isListening ? 'Stop recording' : 'Voice input (Tamil & English)'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="text-[11px] hidden sm:inline">
                  {isListening ? t.voiceListening : language === 'ta' ? 'குரல் உள்ளீடு' : 'Voice'}
                </span>
              </button>

              <span className="text-[10px] text-slate-400 hidden md:inline">
                Shift + Enter for new line
              </span>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition active:scale-95 cursor-pointer ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{t.send}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
