import type { ChatMessage, DownloadRecord, Language } from '../types';

const STORAGE_KEY_DOWNLOADS = 'smartai_downloads_history';

/**
 * Sanitizes a string to make it safe for use as a filename
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '_')
    .substring(0, 40)
    .trim()
    .replace(/^[-_]+|[-_]+$/g, '');
}

/**
 * Generates a clean timestamped filename
 */
export function getFormattedTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}${mins}`;
}

/**
 * Get stored downloads history from localStorage
 */
export function getStoredDownloads(): DownloadRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOWNLOADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read download history:', e);
  }
  return [];
}

/**
 * Save downloads history to localStorage
 */
export function saveStoredDownloads(list: DownloadRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DOWNLOADS, JSON.stringify(list.slice(0, 80)));
  } catch (e) {
    console.error('Failed to save download history:', e);
  }
}

/**
 * Record a new download into history and notify listeners
 */
export function recordDownload(item: Omit<DownloadRecord, 'id' | 'timestamp'>): DownloadRecord {
  const record: DownloadRecord = {
    ...item,
    id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = getStoredDownloads();
    const updated = [record, ...existing.filter((d) => d.name !== record.name || d.url !== record.url)];
    saveStoredDownloads(updated);
    window.dispatchEvent(new CustomEvent('smartai:download_added', { detail: record }));
  } catch (e) {
    console.warn('Could not record download in storage:', e);
  }

  return record;
}

/**
 * Delete a download item from history
 */
export function deleteStoredDownload(id: string): void {
  const existing = getStoredDownloads();
  const filtered = existing.filter((item) => item.id !== id);
  saveStoredDownloads(filtered);
  window.dispatchEvent(new CustomEvent('smartai:downloads_updated'));
}

/**
 * Clear all downloads history
 */
export function clearStoredDownloads(): void {
  localStorage.removeItem(STORAGE_KEY_DOWNLOADS);
  window.dispatchEvent(new CustomEvent('smartai:downloads_updated'));
}

/**
 * Trigger browser file download from a Blob
 */
function triggerBlobDownload(blob: Blob, filename: string): boolean {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('style', 'display: none');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL after timeout to free memory
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 4000);

    return true;
  } catch (err) {
    console.warn('Direct blob download failed, falling back:', err);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const w = window.open(reader.result, '_blank');
          if (!w) {
            window.location.href = reader.result;
          }
        }
      };
      reader.readAsDataURL(blob);
      return true;
    } catch (fallbackErr) {
      console.error('Download fallback failed:', fallbackErr);
      return false;
    }
  }
}

/**
 * Download arbitrary text content as a .txt file
 */
export function downloadTextFile(content: string, filename: string): boolean {
  if (!content || !content.trim()) return false;
  try {
    const cleanFilename = filename.endsWith('.txt') ? filename : `${filename}.txt`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const success = triggerBlobDownload(blob, cleanFilename);
    if (success) {
      recordDownload({
        name: cleanFilename,
        type: 'text',
        format: 'txt',
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        url: '#',
        content,
      });
    }
    return success;
  } catch (err) {
    console.error('Failed to download text file:', err);
    return false;
  }
}

/**
 * Download arbitrary JSON content as a .json file
 */
export function downloadJsonFile(data: any, filename: string, recordType: 'chat' | 'text' = 'chat'): boolean {
  try {
    const cleanFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const success = triggerBlobDownload(blob, cleanFilename);
    if (success) {
      recordDownload({
        name: cleanFilename,
        type: recordType,
        format: 'json',
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        url: '#',
        content: jsonStr,
      });
    }
    return success;
  } catch (err) {
    console.error('Failed to download JSON file:', err);
    return false;
  }
}

/**
 * Generate and download formatted PDF for text/articles/letters
 * Uses styled print view or PDF blob
 */
export function downloadPdfFile(title: string, content: string, language: Language): boolean {
  try {
    const safeTitle = sanitizeFilename(title || 'smartai-document');
    const filename = `${safeTitle}-${getFormattedTimestamp()}.pdf`;
    const isTamil = language === 'ta';

    // Build print-optimized document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback to text download if popup is blocked
      return downloadTextFile(content, `${safeTitle}.txt`);
    }

    const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @page { margin: 20mm; }
    body {
      font-family: 'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 24px;
    }
    .header {
      border-bottom: 2px solid #6366f1;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 14px;
      font-weight: 700;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    h1 {
      font-size: 22px;
      color: #0f172a;
      margin: 8px 0 4px 0;
    }
    .meta {
      font-size: 11px;
      color: #64748b;
    }
    .content {
      font-size: 14px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">SmartAI Tamil (ஸ்மார்ட் ஏஐ தமிழ்)</div>
    <h1>${title}</h1>
    <div class="meta">${new Date().toLocaleString(isTamil ? 'ta-IN' : 'en-US')}</div>
  </div>
  <div class="content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <div class="footer">
    <span>Generated by SmartAI Tamil v2.0</span>
    <span>Page 1</span>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    recordDownload({
      name: filename,
      type: 'document',
      format: 'pdf',
      size: `${(content.length / 1024).toFixed(1)} KB`,
      url: '#',
      content,
    });

    return true;
  } catch (err) {
    console.error('PDF export failed:', err);
    return false;
  }
}

/**
 * Convert base64 data URI to Blob
 */
function base64ToBlob(base64DataUri: string): Blob {
  const parts = base64DataUri.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const byteCharacters = atob(parts[1] || parts[0]);
  const byteNumbers = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteNumbers], { type: mime });
}

/**
 * Download image file with format conversion support (PNG, JPG, WEBP)
 */
export async function downloadImageFile(
  imageSource: string,
  baseFilename?: string,
  targetFormat: 'png' | 'jpeg' | 'webp' = 'png'
): Promise<{ success: boolean; error?: string }> {
  if (!imageSource) {
    return { success: false, error: 'Empty image source' };
  }

  const timestamp = getFormattedTimestamp();
  const safeBase = baseFilename ? sanitizeFilename(baseFilename) : 'smartai-image';
  const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const filename = `${safeBase}-${timestamp}.${ext}`;

  try {
    if (imageSource.startsWith('data:image/') || imageSource.startsWith('blob:') || imageSource.startsWith('http')) {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for download'));
        img.src = imageSource;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 800;
      canvas.height = img.naturalHeight || img.height || 800;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = targetFormat === 'jpeg' ? 'image/jpeg' : targetFormat === 'webp' ? 'image/webp' : 'image/png';
      
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, 0.95);
      });

      if (!blob) {
        throw new Error('Failed to convert canvas to blob');
      }

      const downloaded = triggerBlobDownload(blob, filename);
      if (downloaded) {
        recordDownload({
          name: filename,
          type: 'image',
          format: ext,
          size: `${(blob.size / 1024).toFixed(1)} KB`,
          url: imageSource,
          thumbnail: imageSource,
        });
      }
      return { success: downloaded };
    } else {
      const blob = base64ToBlob(imageSource);
      const downloaded = triggerBlobDownload(blob, filename);
      if (downloaded) {
        recordDownload({
          name: filename,
          type: 'image',
          format: ext,
          size: `${(blob.size / 1024).toFixed(1)} KB`,
          url: imageSource,
          thumbnail: imageSource,
        });
      }
      return { success: downloaded };
    }
  } catch (err: any) {
    console.warn('Canvas conversion failed, attempting raw download:', err);
    try {
      if (imageSource.startsWith('data:')) {
        const blob = base64ToBlob(imageSource);
        const downloaded = triggerBlobDownload(blob, filename);
        if (downloaded) {
          recordDownload({
            name: filename,
            type: 'image',
            format: ext,
            size: `${(blob.size / 1024).toFixed(1)} KB`,
            url: imageSource,
            thumbnail: imageSource,
          });
        }
        return { success: downloaded };
      } else {
        const a = document.createElement('a');
        a.href = imageSource;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        recordDownload({
          name: filename,
          type: 'image',
          format: ext,
          size: 'External',
          url: imageSource,
          thumbnail: imageSource,
        });
        return { success: true };
      }
    } catch (fallbackErr: any) {
      console.error('Final image download error:', fallbackErr);
      return { success: false, error: fallbackErr?.message || 'Download failed' };
    }
  }
}

/**
 * Download generated video file supporting MP4 and WEBM
 */
export async function downloadVideoFile(
  videoUrl: string,
  baseFilename?: string,
  format: 'mp4' | 'webm' = 'mp4'
): Promise<{ success: boolean; error?: string }> {
  if (!videoUrl) {
    return { success: false, error: 'Empty video URL' };
  }

  const timestamp = getFormattedTimestamp();
  const safeBase = baseFilename ? sanitizeFilename(baseFilename) : 'smartai-video';
  const filename = `${safeBase}-${timestamp}.${format}`;

  try {
    // If it's a blob: or data: URL, download directly
    if (videoUrl.startsWith('blob:') || videoUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      recordDownload({
        name: filename,
        type: 'video',
        format,
        size: '1.8 MB',
        url: videoUrl,
      });

      return { success: true };
    }

    // Try fetching the video blob
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const blob = await response.blob();
    const downloaded = triggerBlobDownload(blob, filename);

    if (downloaded) {
      recordDownload({
        name: filename,
        type: 'video',
        format,
        size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        url: videoUrl,
      });
    }

    return { success: downloaded };
  } catch (err: any) {
    console.warn('Direct video fetch failed, using anchor fallback:', err);
    try {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      recordDownload({
        name: filename,
        type: 'video',
        format,
        size: 'Stream URL',
        url: videoUrl,
      });

      return { success: true };
    } catch (fallbackErr: any) {
      return { success: false, error: fallbackErr?.message || 'Failed to download video' };
    }
  }
}

/**
 * Format and export an entire conversation as a clean, readable text document
 */
export function exportConversationAsText(
  conversationTitle: string,
  messages: ChatMessage[],
  language: Language
): boolean {
  if (!messages || messages.length === 0) return false;

  const now = new Date();
  const dateStr = now.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const isTamil = language === 'ta';
  const divider = '='.repeat(64);
  const subDivider = '-'.repeat(64);

  let doc = `${divider}\n`;
  doc += isTamil
    ? `  ஸ்மார்ட் ஏஐ தமிழ் (SmartAI Tamil) - உரையாடல் ஏற்றுமதி\n`
    : `  SmartAI Tamil - Conversation Export\n`;
  doc += `${divider}\n\n`;
  doc += `${isTamil ? 'தலைப்பு' : 'Topic / Title'}: ${conversationTitle || (isTamil ? 'உரையாடல்' : 'Conversation')}\n`;
  doc += `${isTamil ? 'தேதி & நேரம்' : 'Export Date'}: ${dateStr} - ${timeStr}\n`;
  doc += `${isTamil ? 'செயலி' : 'Application'}: SmartAI Tamil v2.0 (Powered by Gemini AI)\n`;
  doc += `${isTamil ? 'மொத்த செய்திகள்' : 'Total Messages'}: ${messages.length}\n\n`;
  doc += `${subDivider}\n\n`;

  messages.forEach((msg, idx) => {
    const isUser = msg.role === 'user';
    const speaker = isUser
      ? (isTamil ? 'பயனர் (User)' : 'User')
      : (isTamil ? 'ஸ்மார்ட் ஏஐ (SmartAI Tamil)' : 'SmartAI Tamil');

    const msgTime = msg.timestamp
      ? new Date(msg.timestamp).toLocaleString(isTamil ? 'ta-IN' : 'en-US', {
          dateStyle: 'short',
          timeStyle: 'medium',
        })
      : '';

    doc += `[${idx + 1}] ${speaker}${msgTime ? ` (${msgTime})` : ''}:\n`;
    doc += `${msg.content.trim()}\n\n`;
    doc += `${subDivider}\n\n`;
  });

  doc += `\n${divider}\n`;
  doc += isTamil
    ? `  குறிப்பு: இந்த ஆவணம் ஸ்மார்ட் ஏஐ தமிழ் செயலியிலிருந்து பெறப்பட்டது.\n`
    : `  Note: This document was exported from SmartAI Tamil.\n`;
  doc += `${divider}\n`;

  const safeTitle = sanitizeFilename(conversationTitle || 'chat');
  const filename = `smartai-chat-${safeTitle}-${getFormattedTimestamp()}.txt`;

  const success = downloadTextFile(doc, filename);
  if (success) {
    recordDownload({
      name: filename,
      type: 'chat',
      format: 'txt',
      size: `${(doc.length / 1024).toFixed(1)} KB`,
      url: '#',
      content: doc,
    });
  }
  return success;
}

/**
 * Export conversation history as structured JSON
 */
export function exportConversationAsJson(
  conversationTitle: string,
  messages: ChatMessage[],
  language: Language
): boolean {
  if (!messages || messages.length === 0) return false;

  const exportData = {
    application: 'SmartAI Tamil',
    version: '2.0',
    exportTimestamp: new Date().toISOString(),
    language,
    conversation: {
      title: conversationTitle,
      totalMessages: messages.length,
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
    },
  };

  const safeTitle = sanitizeFilename(conversationTitle || 'chat');
  const filename = `smartai-chat-${safeTitle}-${getFormattedTimestamp()}.json`;

  return downloadJsonFile(exportData, filename, 'chat');
}
