import React, { useState, useEffect, useCallback } from 'react';
import {
  ApiStatus,
  ChatMessage,
  Conversation,
  Language,
  Theme,
  ToolType,
} from './types';
import {
  generateChatTitle,
  getStoredActiveConversationId,
  getStoredConversations,
  getStoredLanguage,
  getStoredTheme,
  saveStoredActiveConversationId,
  saveStoredConversations,
  saveStoredLanguage,
  saveStoredTheme,
} from './utils/storage';
import { translations } from './utils/translations';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { WritingAssistantView } from './components/WritingAssistantView';
import { ToolsDashboardView } from './components/ToolsDashboardView';
import { ImageGenView } from './components/ImageGenView';
import { SettingsModal } from './components/SettingsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { exportConversationAsText } from './utils/download';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const [activeTool, setActiveTool] = useState<ToolType>('chat');
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getStoredConversations()
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    () => getStoredActiveConversationId()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);

  // Sync theme with HTML document element
  useEffect(() => {
    saveStoredTheme(theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // Sync language
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    saveStoredLanguage(newLang);
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch API status on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setApiStatus(data);
        }
      } catch (err) {
        console.warn('Could not connect to /api/status endpoint:', err);
      }
    };
    checkApiStatus();
  }, []);

  // Save conversations to localStorage whenever they update
  useEffect(() => {
    saveStoredConversations(conversations);
  }, [conversations]);

  // Save active conversation id
  useEffect(() => {
    saveStoredActiveConversationId(activeConversationId);
  }, [activeConversationId]);

  // Current active conversation
  const currentConversation =
    conversations.find((c) => c.id === activeConversationId) || null;
  const currentMessages = currentConversation ? currentConversation.messages : [];

  // Start new conversation
  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setActiveTool('chat');
  }, []);

  // Send message in Chat
  const handleSendMessage = async (text: string, customSystemPrompt?: string) => {
    if (!text.trim() || isLoading) return;

    let targetConvoId = activeConversationId;
    let updatedConversations = [...conversations];

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // If there is no active conversation or it doesn't exist, create one
    if (!targetConvoId || !conversations.some((c) => c.id === targetConvoId)) {
      targetConvoId = 'convo-' + Date.now();
      const newConvo: Conversation = {
        id: targetConvoId,
        title: generateChatTitle(text, language),
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language,
      };
      updatedConversations = [newConvo, ...updatedConversations];
      setActiveConversationId(targetConvoId);
    } else {
      updatedConversations = updatedConversations.map((convo) => {
        if (convo.id === targetConvoId) {
          return {
            ...convo,
            messages: [...convo.messages, userMessage],
            updatedAt: new Date().toISOString(),
          };
        }
        return convo;
      });
    }

    setConversations(updatedConversations);
    setIsLoading(true);

    try {
      // Find the messages array to send to Gemini
      const activeConvo = updatedConversations.find((c) => c.id === targetConvoId);
      const conversationHistory = activeConvo ? activeConvo.messages : [userMessage];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
          customSystemPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI response');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        timestamp: data.timestamp || new Date().toISOString(),
        status: 'success',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvoId) {
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          language === 'ta'
            ? 'மன்னிக்கவும், AI சேவையகத்துடன் தொடர்பு கொள்ள முடியவில்லை. தயவுசெய்து உங்கள் இணைய இணைப்பை அல்லது API நிலையை சரிபார்க்கவும்.'
            : 'Sorry, unable to connect to Gemini AI service. Please check your internet connection or API status in Settings.',
        timestamp: new Date().toISOString(),
        status: 'error',
        errorMessage: err?.message,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvoId) {
            return {
              ...c,
              messages: [...c.messages, errorMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Retry an assistant response
  const handleRetryMessage = (messageIndex: number) => {
    if (!currentConversation) return;
    const historyUpToRetry = currentConversation.messages.slice(0, messageIndex);
    // Find the last user message before this index
    const lastUserMsg = [...historyUpToRetry].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Filter conversation messages up to the user message
    const filteredMessages = currentConversation.messages.slice(0, messageIndex);
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: filteredMessages,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // Re-fetch
    setIsLoading(true);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: filteredMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        language,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const newAssistantMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.text,
          timestamp: new Date().toISOString(),
          status: 'success',
        };
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConversationId) {
              return {
                ...c,
                messages: [...c.messages, newAssistantMsg],
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          })
        );
      })
      .catch((err) => {
        const failMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: language === 'ta' ? 'மீண்டும் முயற்சி தோல்வியடைந்தது.' : 'Retry request failed.',
          timestamp: new Date().toISOString(),
          status: 'error',
          errorMessage: err?.message,
        };
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConversationId) {
              return {
                ...c,
                messages: [...c.messages, failMsg],
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Rename a conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  // Delete a conversation
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  // Clear all conversations
  const handleClearAllConversations = () => {
    setConversations([]);
    setActiveConversationId(null);
  };

  // Navigation from dashboard or other tools
  const handleNavigateToTool = (tool: ToolType, starterPrompt?: string) => {
    setActiveTool(tool);
    if (starterPrompt) {
      if (tool === 'chat' || tool === 'coding' || tool === 'study' || tool === 'ideas' || tool === 'business') {
        setActiveTool('chat');
        let roleInstruction = '';
        if (tool === 'coding') {
          roleInstruction = 'You are a senior software engineer mentoring the user in programming, architecture, and debugging.';
        } else if (tool === 'study') {
          roleInstruction = 'You are a patient academic tutor breaking down educational concepts with step-by-step clarity.';
        } else if (tool === 'ideas') {
          roleInstruction = 'You are an innovation strategist helping the user brainstorm viable, creative ideas.';
        } else if (tool === 'business') {
          roleInstruction = 'You are an executive marketing and business growth specialist.';
        }

        handleSendMessage(starterPrompt, roleInstruction);
      }
    }
  };

  // Send content created in Writing Assistant to a chat conversation
  const handleSendWritingToChat = (prompt: string, response: string) => {
    const targetConvoId = 'convo-' + Date.now();
    const newConvo: Conversation = {
      id: targetConvoId,
      title: generateChatTitle(prompt, language),
      messages: [
        {
          id: Date.now().toString(),
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
          status: 'success',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language,
    };

    setConversations((prev) => [newConvo, ...prev]);
    setActiveConversationId(targetConvoId);
    setActiveTool('chat');
  };

  return (
    <div className={`flex h-screen w-full flex-col overflow-hidden font-sans ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        activeTool={activeTool}
        apiStatus={apiStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace: Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          language={language}
          activeTool={activeTool}
          onSelectTool={(tool) => setActiveTool(tool)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setActiveTool('chat');
          }}
          onNewChat={handleNewChat}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
          onClearAllConversations={handleClearAllConversations}
          onExportConversation={(convo) => exportConversationAsText(convo.title, convo.messages, language)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Dynamic Tool View Area */}
        <main className="relative flex flex-1 flex-col overflow-hidden bg-slate-950/40">
          {activeTool === 'chat' && (
            <ChatView
              language={language}
              messages={currentMessages}
              isLoading={isLoading}
              conversationTitle={currentConversation?.title}
              onSendMessage={(text) => handleSendMessage(text)}
              onRetryMessage={handleRetryMessage}
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              onExportChat={() => {
                if (currentConversation && currentConversation.messages.length > 0) {
                  exportConversationAsText(currentConversation.title, currentConversation.messages, language);
                }
              }}
            />
          )}

          {activeTool === 'dashboard' && (
            <ToolsDashboardView
              language={language}
              onNavigateToTool={handleNavigateToTool}
            />
          )}

          {activeTool === 'writing' && (
            <WritingAssistantView
              language={language}
              onSendToChat={handleSendWritingToChat}
            />
          )}

          {activeTool === 'translation' && (
            <WritingAssistantView
              language={language}
              onSendToChat={handleSendWritingToChat}
            />
          )}

          {activeTool === 'coding' && (
            <ToolsDashboardView
              language={language}
              onNavigateToTool={handleNavigateToTool}
            />
          )}

          {activeTool === 'study' && (
            <ToolsDashboardView
              language={language}
              onNavigateToTool={handleNavigateToTool}
            />
          )}

          {activeTool === 'ideas' && (
            <ToolsDashboardView
              language={language}
              onNavigateToTool={handleNavigateToTool}
            />
          )}

          {activeTool === 'business' && (
            <ToolsDashboardView
              language={language}
              onNavigateToTool={handleNavigateToTool}
            />
          )}

          {activeTool === 'image' && (
            <ImageGenView
              language={language}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        apiStatus={apiStatus}
        onClearAllData={handleClearAllConversations}
      />

      {/* Offline Connectivity Warning */}
      <OfflineIndicator language={language} />
    </div>
  );
}
