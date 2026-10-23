export type Language = 'ta' | 'en';
export type Theme = 'dark' | 'light';

export type ToolType = 
  | 'chat'
  | 'dashboard'
  | 'writing'
  | 'translation'
  | 'coding'
  | 'study'
  | 'ideas'
  | 'business'
  | 'image'
  | 'video'
  | 'downloads'
  | 'android-app'
  | 'settings';

export type WritingSubType =
  | 'letter-email'
  | 'social-caption'
  | 'business-ad'
  | 'youtube-script'
  | 'story-article'
  | 'professional-message'
  | 'translation-ta-en'
  | 'translation-en-ta';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'sending' | 'success' | 'error';
  errorMessage?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  language: Language;
}

export interface ApiStatus {
  status: string;
  hasApiKey: boolean;
  activeModel: string;
  supportedLanguages: string[];
  app: string;
}

export interface GeneratedImageRecord {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  style: string;
  createdAt: string;
}

export interface VideoRecord {
  id: string;
  title: string;
  prompt: string;
  duration: string;
  aspectRatio: string;
  videoUrl: string;
  format: 'mp4' | 'webm';
  fileSize: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface DownloadRecord {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'chat' | 'text';
  format: string; // 'png' | 'jpg' | 'webp' | 'mp4' | 'webm' | 'txt' | 'json' | 'pdf'
  size?: string;
  url: string;
  content?: string;
  timestamp: string;
  thumbnail?: string;
}

export interface ApkStatus {
  isReady: boolean;
  apkUrl?: string;
  fileName?: string;
  fileSize?: string;
  version?: string;
  sha256?: string;
}
