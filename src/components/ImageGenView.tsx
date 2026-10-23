import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  AlertCircle,
  Maximize2,
  X,
  History,
  Info,
  ExternalLink,
  Layers,
  Palette,
  CheckCircle2,
  FileImage,
} from 'lucide-react';
import { GeneratedImageRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { getStoredImages, saveStoredImages } from '../utils/storage';
import { downloadImageFile } from '../utils/download';

interface ImageGenViewProps {
  language: Language;
  onSendToChat?: (prompt: string, imageUrl: string) => void;
}

export const ImageGenView: React.FC<ImageGenViewProps> = ({
  language,
}) => {
  const t = translations[language];
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('Photorealistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImageRecord | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GeneratedImageRecord[]>([]);
  const [zoomedImage, setZoomedImage] = useState<GeneratedImageRecord | null>(null);
  
  // Download format and state
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setGallery(getStoredImages());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const aspectRatios = [
    { id: '1:1', label: '1:1 (Square)', desc: 'Instagram Post, Avatar' },
    { id: '16:9', label: '16:9 (Landscape)', desc: 'YouTube Thumbnail, Desktop' },
    { id: '9:16', label: '9:16 (Portrait)', desc: 'Story, Reels, Mobile' },
    { id: '4:3', label: '4:3 (Classic)', desc: 'Photography Standard' },
  ];

  const styles = [
    { id: 'Photorealistic', label: language === 'ta' ? 'உண்மை நிழற்படம் (Photorealistic)' : 'Photorealistic' },
    { id: 'Cinematic', label: language === 'ta' ? 'திரைப்பட பாணி (Cinematic)' : 'Cinematic' },
    { id: 'Digital Art', label: language === 'ta' ? 'டிஜிட்டல் ஆர்ட் (Digital Art)' : 'Digital Art' },
    { id: '3D Render', label: language === 'ta' ? '3D ரெண்டர் (3D Render)' : '3D Render' },
    { id: 'Anime / Fantasy', label: language === 'ta' ? 'அனிமே / கற்பனை (Anime)' : 'Anime / Fantasy' },
    { id: 'Oil Painting', label: language === 'ta' ? 'எண்ணெய் ஓவியம் (Oil Painting)' : 'Oil Painting' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorDetails(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Image generation failed');
      }

      if (data.imageUrl) {
        const newRecord: GeneratedImageRecord = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt: prompt.trim(),
          aspectRatio,
          style,
          createdAt: new Date().toISOString(),
        };

        setCurrentImage(newRecord);
        const updatedGallery = [newRecord, ...gallery];
        setGallery(updatedGallery);
        saveStoredImages(updatedGallery);
      } else {
        throw new Error(data.message || 'No image data returned from model');
      }
    } catch (err: any) {
      console.warn('Image generation error:', err);
      setErrorDetails(
        err?.message ||
          (language === 'ta'
            ? 'பட உருவாக்கம் தற்போது கிடைக்கவில்லை. API அனுமதி அல்லது மாதிரியின் ஒதுக்கீட்டை சரிபார்க்கவும்.'
            : 'Image generation is currently unavailable. Please verify API quotas or model permissions.')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async (
    record: GeneratedImageRecord,
    targetFormat: 'png' | 'jpeg' | 'webp' = downloadFormat
  ) => {
    if (isDownloading) return; // Prevent duplicate download clicks
    setIsDownloading(true);

    try {
      const result = await downloadImageFile(record.url, record.prompt, targetFormat);
      if (result.success) {
        showToast(
          language === 'ta'
            ? `படம் ${targetFormat.toUpperCase()} வடிவத்தில் பதிவிறக்கப்பட்டது!`
            : `Image downloaded as ${targetFormat.toUpperCase()} successfully!`
        );
      } else {
        showToast(result.error || t.downloadFailed);
      }
    } catch (err: any) {
      console.error('Download handler error:', err);
      showToast(t.downloadFailed);
    } finally {
      setIsDownloading(false);
    }
  };

  // Safe fallback to open in new tab
  const handleOpenInNewTab = (url: string) => {
    const w = window.open();
    if (w) {
      w.document.write(`<title>SmartAI Image</title><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${url}" style="max-width:100%;max-height:100%;object-contain:fit;" /></body>`);
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="relative flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full">
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
          <ImageIcon className="h-6 w-6 text-pink-400" />
          <span>{t.imageGenTitle}</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">{t.imageGenDesc}</p>
      </div>

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Prompt & Settings */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>{language === 'ta' ? 'படத்தின் விவரிப்பு (Prompt):' : 'Image Description (Prompt):'}</span>
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.imagePromptPlaceholder}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition resize-none"
            />
          </div>

          {/* Aspect Ratio Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-purple-400" />
              <span>{t.aspectRatio}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id)}
                  className={`flex flex-col rounded-xl p-2.5 text-left border transition cursor-pointer ${
                    aspectRatio === ar.id
                      ? 'border-indigo-500 bg-indigo-600/15 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold">{ar.label}</span>
                  <span className="text-[10px] text-slate-400">{ar.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-pink-400" />
              <span>{t.style}</span>
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {styles.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white shadow-lg transition active:scale-[0.99] cursor-pointer ${
              prompt.trim() && !isGenerating
                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-pink-600/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{t.generatingImage}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{t.generateImage}</span>
              </>
            )}
          </button>

          {/* Disclaimer notice */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-3 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>{t.imageDisclaimer}</span>
          </div>

          {/* Error notice if generation is restricted / unpaid quota */}
          {errorDetails && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs text-amber-200 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{language === 'ta' ? 'பட சேவை தகவல்' : 'Service Notice'}</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">{errorDetails}</p>
            </div>
          )}
        </div>

        {/* Right Preview & Showcase */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Main Visual Display */}
          <div className="relative min-h-[360px] rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl flex flex-col items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3 p-8">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 text-white animate-pulse shadow-lg">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div className="text-sm font-semibold text-slate-200">{t.generatingImage}</div>
                <div className="text-xs text-slate-400 max-w-xs">{prompt}</div>
              </div>
            ) : currentImage ? (
              <div className="w-full flex flex-col items-center">
                {/* Image frame */}
                <div className="relative group max-h-[440px] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800/80">
                  <img
                    src={currentImage.url}
                    alt={currentImage.prompt}
                    className="max-h-[420px] w-auto object-contain rounded-xl shadow-2xl transition duration-300 group-hover:scale-[1.01]"
                  />
                  {/* Floating Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setZoomedImage(currentImage)}
                      className="rounded-xl bg-white/20 p-2.5 text-white backdrop-blur-md hover:bg-white/30 transition cursor-pointer"
                      title="View Full Size"
                    >
                      <Maximize2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownloadImage(currentImage, downloadFormat)}
                      className="rounded-xl bg-white/20 p-2.5 text-white backdrop-blur-md hover:bg-white/30 transition cursor-pointer"
                      title={t.downloadImage}
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleOpenInNewTab(currentImage.url)}
                      className="rounded-xl bg-white/20 p-2.5 text-white backdrop-blur-md hover:bg-white/30 transition cursor-pointer"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Visible Download & Controls Bar below the image */}
                <div className="mt-3.5 flex flex-col sm:flex-row w-full items-center justify-between gap-3 rounded-2xl bg-slate-950/90 border border-slate-800 p-3 shadow-lg">
                  {/* Prompt label */}
                  <div className="flex items-center gap-2 max-w-full sm:max-w-[45%] truncate text-xs text-slate-300">
                    <FileImage className="h-4 w-4 shrink-0 text-pink-400" />
                    <span className="truncate font-medium">{currentImage.prompt}</span>
                  </div>

                  {/* Format selector & Download action button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Format Selector Pills (PNG, JPG, WEBP) */}
                    <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs font-semibold">
                      {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setDownloadFormat(fmt)}
                          className={`rounded-lg px-2 py-1 uppercase text-[11px] transition cursor-pointer ${
                            downloadFormat === fmt
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {fmt === 'jpeg' ? 'JPG' : fmt}
                        </button>
                      ))}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadImage(currentImage, downloadFormat)}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-pink-600/25 transition active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>{t.downloading}</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>{t.downloadImage}</span>
                        </>
                      )}
                    </button>

                    {/* Open in tab fallback button */}
                    <button
                      onClick={() => handleOpenInNewTab(currentImage.url)}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <div className="h-16 w-16 rounded-3xl bg-slate-800/50 flex items-center justify-center text-slate-600 mb-3">
                  <ImageIcon className="h-8 w-8 stroke-1" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300">
                  {language === 'ta' ? 'படம் ஏதுமில்லை' : 'No image generated yet'}
                </h4>
                <p className="mt-1 text-xs max-w-xs text-slate-400">
                  {language === 'ta'
                    ? 'இடதுபுறம் உங்கள் கற்பனைக் காட்சியை உள்ளிட்டு "படத்தை உருவாக்கு" பொத்தானை அழுத்தவும்.'
                    : 'Describe what you want to create and click "Generate Image" to visualize and download it.'}
                </p>
              </div>
            )}
          </div>

          {/* Past Generated Gallery */}
          {gallery.length > 0 && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                <div className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5" />
                  <span>{language === 'ta' ? 'முந்தைய படங்கள்' : 'Recent Creations'}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {language === 'ta' ? 'பதிவிறக்க தட்டவும்' : 'Tap to view / download'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentImage(item)}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 cursor-pointer hover:border-indigo-500 transition shadow-md"
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-2">
                      <span className="text-[10px] text-white line-clamp-2 text-center">{item.prompt}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage(item, 'png');
                          }}
                          className="rounded-lg bg-indigo-600/90 p-1.5 text-white shadow-md hover:bg-indigo-500 transition"
                          title={t.downloadImage}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedImage(item);
                          }}
                          className="rounded-lg bg-white/20 p-1.5 text-white hover:bg-white/30 transition"
                          title="Zoom"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Zoom Modal with Download Controls */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center"
          >
            {/* Close button */}
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 transition"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Big Image */}
            <img
              src={zoomedImage.url}
              alt={zoomedImage.prompt}
              className="max-h-[75vh] w-auto rounded-2xl shadow-2xl object-contain border border-slate-700"
            />

            {/* Modal download toolbar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-slate-900/90 border border-slate-700 px-5 py-2.5 shadow-2xl backdrop-blur-md">
              <span className="text-xs text-slate-300 max-w-xs truncate hidden sm:inline">
                {zoomedImage.prompt}
              </span>

              <div className="flex items-center gap-1.5">
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleDownloadImage(zoomedImage, fmt)}
                    className="flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
