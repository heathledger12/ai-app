import React, { useState } from 'react';
import {
  Mail,
  Share2,
  Megaphone,
  Video,
  BookOpen,
  MessageSquare,
  Languages,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Send,
  AlertCircle,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Language, WritingSubType } from '../types';
import { translations } from '../utils/translations';
import { MarkdownRenderer } from './MarkdownRenderer';
import { downloadTextFile, getFormattedTimestamp } from '../utils/download';

interface WritingAssistantViewProps {
  language: Language;
  onSendToChat: (prompt: string, response: string) => void;
}

export const WritingAssistantView: React.FC<WritingAssistantViewProps> = ({
  language,
  onSendToChat,
}) => {
  const t = translations[language];
  const [subType, setSubType] = useState<WritingSubType>('letter-email');
  const [userPrompt, setUserPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [outputLanguage, setOutputLanguage] = useState<Language>(language);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = [
    {
      id: 'letter-email' as WritingSubType,
      label: language === 'ta' ? 'கடிதம் / மின்னஞ்சல்' : 'Letters & Emails',
      icon: Mail,
      desc: language === 'ta' ? 'அலுவலக மற்றும் தனிப்பட்ட கடிதங்கள்' : 'Formal, job application, sick leave, inquiry',
      placeholder: language === 'ta'
        ? 'எ.கா: மருத்துவ விடுப்பு வேண்டி மேலாளருக்கு 3 நாள் மின்னஞ்சல்...'
        : 'e.g. Request 3 days sick leave to manager due to severe viral fever...',
    },
    {
      id: 'social-caption' as WritingSubType,
      label: language === 'ta' ? 'சமூக ஊடக தலைப்புகள்' : 'Social Media Captions',
      icon: Share2,
      desc: language === 'ta' ? 'Instagram, Facebook, LinkedIn பதிவுகள்' : 'Captions with emojis and trending hashtags',
      placeholder: language === 'ta'
        ? 'எ.கா: புதிய பாரம்பரிய தமிழ் ஆடை கடை திறப்பு விழா பதிவு...'
        : 'e.g. Launching a new organic traditional filter coffee brand...',
    },
    {
      id: 'business-ad' as WritingSubType,
      label: language === 'ta' ? 'வணிக விளம்பரம்' : 'Business Ads',
      icon: Megaphone,
      desc: language === 'ta' ? 'விற்பனையை பெருக்கும் கவர்ச்சிகர விளம்பர வாசகங்கள்' : 'High-converting ad copy with strong CTA',
      placeholder: language === 'ta'
        ? 'எ.கா: தீபாவளி தள்ளுபடி சலுகை 40% தள்ளுபடி விளம்பர வாசகம்...'
        : 'e.g. 50% festive discount on professional web development services...',
    },
    {
      id: 'youtube-script' as WritingSubType,
      label: language === 'ta' ? 'YouTube ஸ்கிரிப்ட்' : 'YouTube Scripts',
      icon: Video,
      desc: language === 'ta' ? 'முழுமையான வீடியோ கட்டமைப்பு மற்றும் பேசும் வரிகள்' : 'Hook, main points, B-roll cues & CTA',
      placeholder: language === 'ta'
        ? 'எ.கா: 2026-ல் AI கற்றுக்கொள்வது எப்படி? 10 நிமிட வீடியோ...'
        : 'e.g. 10 tips to master AI productivity tools in 2026...',
    },
    {
      id: 'story-article' as WritingSubType,
      label: language === 'ta' ? 'கதை & கட்டுரை' : 'Stories & Articles',
      icon: BookOpen,
      desc: language === 'ta' ? 'ஆக்கப்பூர்வமான சிறுகதைகள் மற்றும் ஆய்வுக் கட்டுரைகள்' : 'Engaging narrative stories, blog posts, essays',
      placeholder: language === 'ta'
        ? 'எ.கா: பொங்கல் திருவிழா பற்றிய ஒரு அழகிய வரலாற்று சிறுகதை...'
        : 'e.g. A motivational story about an underdog entrepreneur in Chennai...',
    },
    {
      id: 'professional-message' as WritingSubType,
      label: language === 'ta' ? 'தொழில்முறை செய்தி' : 'Professional Messages',
      icon: MessageSquare,
      desc: language === 'ta' ? 'WhatsApp, Slack, கிளையன்ட் செய்திகள்' : 'Polite reminders, follow-ups, client greetings',
      placeholder: language === 'ta'
        ? 'எ.கா: நிலுவையில் உள்ள கட்டணத்தை நினைவூட்டும் கண்ணியமான செய்தி...'
        : 'e.g. Gentle payment reminder for an overdue invoice with gratitude...',
    },
    {
      id: 'translation-ta-en' as WritingSubType,
      label: language === 'ta' ? 'தமிழ் ➔ English' : 'Tamil ➔ English',
      icon: Languages,
      desc: language === 'ta' ? 'துல்லியமான ஆங்கில மொழிபெயர்ப்பு' : 'Translate Tamil into polished natural English',
      placeholder: language === 'ta'
        ? 'ஆங்கிலத்தில் மொழிபெயர்க்க வேண்டிய தமிழ் வாசகங்களை இங்கு உள்ளிடவும்...'
        : 'Enter Tamil text to translate into fluent English...',
    },
    {
      id: 'translation-en-ta' as WritingSubType,
      label: language === 'ta' ? 'English ➔ தமிழ்' : 'English ➔ Tamil',
      icon: Languages,
      desc: language === 'ta' ? 'நேர்த்தியான தமிழ் மொழிபெயர்ப்பு' : 'Translate English into elegant Tamil',
      placeholder: language === 'ta'
        ? 'தமிழில் மொழிபெயர்க்க வேண்டிய ஆங்கில வாசகங்களை இங்கு உள்ளிடவும்...'
        : 'Enter English text to translate into natural Tamil...',
    },
  ];

  const activeCategory = categories.find((c) => c.id === subType) || categories[0];

  const tones = [
    { id: 'professional', label: language === 'ta' ? 'மரியாதையான / தொழில்முறை (Professional)' : 'Professional' },
    { id: 'friendly', label: language === 'ta' ? 'நட்பான (Friendly)' : 'Friendly' },
    { id: 'persuasive', label: language === 'ta' ? 'ஈர்க்கும் (Persuasive)' : 'Persuasive' },
    { id: 'creative', label: language === 'ta' ? 'கற்பனை நயம் (Creative)' : 'Creative' },
    { id: 'formal', label: language === 'ta' ? 'முறையான (Formal)' : 'Formal' },
  ];

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setResult('');

    try {
      const response = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: subType,
          prompt: userPrompt.trim(),
          language: outputLanguage,
          tone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err?.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result || downloaded) return;
    const timestamp = getFormattedTimestamp();
    const filename = `smartai-${subType}-${timestamp}.txt`;
    const success = downloadTextFile(result, filename);
    if (success) {
      setDownloaded(true);
      showToast(t.downloadSuccess);
      setTimeout(() => setDownloaded(false), 2500);
    } else {
      showToast(t.downloadFailed);
    }
  };

  const handleToggleSpeech = () => {
    if (!result || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = result.replace(/[*#`_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = outputLanguage === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
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
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <span>{t.writingToolHeader}</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          {language === 'ta'
            ? 'மின்னஞ்சல்கள், கட்டுரைகள், விளம்பரங்கள் மற்றும் இருமொழி மொழிபெயர்ப்புகளை நொடிகளில் உருவாக்கி பதிவிறக்குங்கள்.'
            : 'Craft and download high-impact emails, social captions, ad copy, and bilingual translations in seconds.'}
        </p>
      </div>

      {/* Grid of Writing Category Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = subType === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSubType(cat.id);
                setResult('');
              }}
              className={`flex flex-col items-start rounded-2xl p-3 border text-left transition cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-600/15 text-white shadow-md shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div
                className={`rounded-xl p-2 mb-2 ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold leading-tight line-clamp-1">{cat.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{cat.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              {activeCategory.label}
            </h2>
          </div>

          {/* Prompt textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {language === 'ta' ? 'உங்கள் தேவை / தலைப்பு:' : 'Your topic or brief:'}
            </label>
            <textarea
              rows={5}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder={activeCategory.placeholder}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition resize-none"
            />
          </div>

          {/* Tone & Target Language Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.toneLabel}</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                {tones.map((to) => (
                  <option key={to.id} value={to.id}>
                    {to.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {language === 'ta' ? 'வெளியீட்டு மொழி:' : 'Output Language:'}
              </label>
              <select
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value as Language)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!userPrompt.trim() || isGenerating}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white shadow-lg transition active:scale-[0.99] cursor-pointer ${
              userPrompt.trim() && !isGenerating
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-600/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{t.generatingContent}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{t.generateContent}</span>
              </>
            )}
          </button>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Output Result Panel */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex flex-col min-h-[380px]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">{t.resultTitle}</h2>

            {result && (
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Download Text button */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white px-2.5 py-1 text-xs font-medium transition cursor-pointer active:scale-95"
                  title={t.downloadText}
                >
                  {downloaded ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{t.downloadSuccess}</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>{t.downloadText}</span>
                    </>
                  )}
                </button>

                {/* Read Aloud */}
                <button
                  onClick={handleToggleSpeech}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs transition ${
                    isSpeaking
                      ? 'bg-indigo-500/20 text-indigo-400 animate-pulse'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                  title={isSpeaking ? t.stopAudio : t.readAloud}
                >
                  {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isSpeaking ? t.stopAudio : t.readAloud}</span>
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
                  title={t.copy}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{t.copy}</span>
                    </>
                  )}
                </button>

                {/* Send to chat */}
                <button
                  onClick={() => onSendToChat(userPrompt, result)}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-2.5 py-1 text-xs transition"
                  title="Send to Chat"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {language === 'ta' ? 'அரட்டைக்கு' : 'To Chat'}
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-3">
            {isGenerating ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 animate-pulse">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-xs text-slate-400">{t.generatingContent}</p>
              </div>
            ) : result ? (
              <div className="text-sm text-slate-100 leading-relaxed">
                <MarkdownRenderer content={result} />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-8 text-slate-500">
                <Mail className="h-10 w-10 stroke-1 mb-2 text-slate-600" />
                <p className="text-xs max-w-xs">
                  {language === 'ta'
                    ? 'உங்கள் தேவையை உள்ளிட்டு "உள்ளடக்கத்தை உருவாக்கு" பொத்தானை அழுத்தவும்.'
                    : 'Enter your brief on the left and click "Generate Content" to see the output here.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
