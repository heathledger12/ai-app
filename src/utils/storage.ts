import { Conversation, Language, Theme, GeneratedImageRecord } from '../types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'smartai_conversations',
  ACTIVE_CONVO_ID: 'smartai_active_convo_id',
  THEME: 'smartai_theme',
  LANGUAGE: 'smartai_language',
  IMAGES: 'smartai_images',
};

export function getStoredLanguage(): Language {
  try {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (lang === 'ta' || lang === 'en') return lang;
  } catch (e) {
    console.error('Storage error:', e);
  }
  return 'ta'; // Default to Tamil
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export function getStoredTheme(): Theme {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'dark' || theme === 'light') return theme;
  } catch (e) {
    console.error('Storage error:', e);
  }
  return 'dark'; // Default to modern sleek dark
}

export function saveStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export function getStoredConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse stored conversations:', e);
  }
  return [];
}

export function saveStoredConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations:', e);
  }
}

export function getStoredActiveConversationId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVO_ID);
  } catch (e) {
    return null;
  }
}

export function saveStoredActiveConversationId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVO_ID);
    }
  } catch (e) {
    console.error('Failed to save active convo ID:', e);
  }
}

export function getStoredImages(): GeneratedImageRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.IMAGES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read image history:', e);
  }
  return [];
}

export function saveStoredImages(images: GeneratedImageRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save images:', e);
  }
}

// Generate smart title from user prompt
export function generateChatTitle(firstPrompt: string, lang: Language): string {
  const clean = firstPrompt.trim().replace(/[\r\n]+/g, ' ');
  if (!clean) return lang === 'ta' ? 'புதிய உரையாடல்' : 'New Chat';
  if (clean.length > 36) {
    return clean.substring(0, 34) + '...';
  }
  return clean;
}
