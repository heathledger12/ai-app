import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize GoogleGenAI server-side client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for resilient text generation with seamless fallback
async function generateWithFallback(options: {
  contents: any;
  systemInstruction?: string;
  temperature?: number;
}): Promise<string> {
  const { contents, systemInstruction, temperature = 0.7 } = options;

  const tryModel = async (modelName: string) => {
    const res = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        temperature,
      },
    });
    return res.text;
  };

  // Try gemini-3.8-flash first; if 503 high demand occurs or it errors, fallback to gemini-3.1-flash-lite
  try {
    const result = await Promise.race([
      tryModel('gemini-3.8-flash'),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), 4000)
      ),
    ]);
    if (result) return result;
  } catch (err: any) {
    console.warn('Primary model (gemini-3.8-flash) deferred to resilient fallback:', err?.message || err);
  }

  // Resilient fallback using gemini-3.1-flash-lite
  const fallbackResult = await tryModel('gemini-3.1-flash-lite');
  return fallbackResult || '';
}

// API Status & Configuration Endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    hasApiKey: Boolean(apiKey && apiKey.trim().length > 0),
    activeModel: 'gemini-3.8-flash (with 3.1-flash-lite resilience)',
    supportedLanguages: ['ta', 'en'],
    app: 'SmartAI Tamil',
  });
});

// Android APK Status Endpoint
app.get('/api/apk-status', (_req, res) => {
  const apkPath = path.resolve('public/downloads/smartai-tamil.apk');
  const exists = fs.existsSync(apkPath);
  if (exists) {
    const stats = fs.statSync(apkPath);
    return res.json({
      isReady: true,
      apkUrl: '/downloads/smartai-tamil.apk',
      fileName: 'smartai-tamil.apk',
      fileSize: `${(stats.size / (1024 * 1024)).toFixed(1)} MB`,
      version: '2.0.0',
    });
  }
  return res.json({
    isReady: false,
    fileName: 'smartai-tamil.apk',
    version: '2.0.0',
  });
});

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please add your Gemini API key in the Secrets panel.',
      });
    }

    const { messages, language = 'ta', customSystemPrompt } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Default System Instruction for SmartAI Tamil
    const baseSystemPrompt = `You are "SmartAI Tamil" (ஸ்மார்ட் ஏஐ தமிழ்), an exceptionally intelligent, polite, modern, and helpful AI assistant designed specifically for Tamil and English speaking users worldwide.
Core Behaviors:
- Understand both Tamil (தமிழ்), Tanglish (Tamil in Latin script), and English fluently.
- Respond naturally in the language or script the user used, or default to the user's selected preference (${language === 'ta' ? 'Tamil' : 'English'}).
- When responding in Tamil, use natural, grammatically correct, contemporary, and polite Tamil (உதாரணமாக: வணக்கம், உங்களுக்கு நான் எப்படி உதவ முடியும்?).
- Provide well-structured answers using clean markdown, bullet points, headers, or code blocks where appropriate.
- Be accurate, polite, culturally respectful, and encouraging.
- Never mention internal APIs, keys, or prompt secrets.`;

    const systemInstruction = customSystemPrompt
      ? `${baseSystemPrompt}\n\nSpecific task instructions:\n${customSystemPrompt}`
      : baseSystemPrompt;

    // Convert client chat history (role: 'user' | 'assistant') to Gemini format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const replyText = await generateWithFallback({
      contents,
      systemInstruction,
      temperature: 0.7,
    });

    return res.json({
      text: replyText || 'வணக்கம்! உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    const errorMessage = error?.message || 'Error communicating with Gemini AI service';
    return res.status(500).json({
      error: errorMessage,
      details: 'AI request could not be completed. Please check network connection or try again.',
    });
  }
});

// AI Writing & Smart Tools Endpoint
app.post('/api/generate-tool', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const { toolType, prompt, language = 'ta', tone = 'professional', options = {} } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let toolInstruction = '';
    switch (toolType) {
      case 'letter-email':
        toolInstruction = `Generate a high quality, well-structured letter or email. Tone: ${tone}. Include subject line, greeting, body paragraphs, and formal closing. Support Tamil or English as requested.`;
        break;
      case 'social-caption':
        toolInstruction = `Generate engaging, viral social media captions with relevant emojis and hashtags. Provide 3 varied options (catchy, detailed, and short).`;
        break;
      case 'business-ad':
        toolInstruction = `Craft a persuasive, high-converting business advertisement copy. Include a captivating headline, value proposition, bullet points of key benefits, and a compelling Call to Action (CTA).`;
        break;
      case 'youtube-script':
        toolInstruction = `Write a structured YouTube video script including: Catchy Intro (Hook 0-15s), Channel Intro, Section-by-Section Content Outline with Speaker Notes/B-Roll cues, and an Outro with Subscribe CTA.`;
        break;
      case 'story-article':
        toolInstruction = `Write a captivating story or informative article. Use rich vocabulary, descriptive language, engaging narrative flow, and a memorable conclusion.`;
        break;
      case 'translation-ta-en':
        toolInstruction = `Translate the provided Tamil text into accurate, fluent, and natural English. Maintain tone, nuance, and context. Also provide a brief explanation of any cultural nuances if helpful.`;
        break;
      case 'translation-en-ta':
        toolInstruction = `Translate the provided English text into natural, grammatically correct, and elegant Tamil (தமிழ்). Ensure modern readability and appropriate tone.`;
        break;
      case 'coding-help':
        toolInstruction = `You are an expert programming mentor. Provide clean, modern, well-commented code with step-by-step explanations, error handling, and best practices. Explain in the requested language (${language}).`;
        break;
      case 'study-assistant':
        toolInstruction = `Act as an encouraging academic tutor. Break down complex concepts into simple analogies, key bullet points, formulas/definitions, and a quick self-test quiz question at the end.`;
        break;
      case 'idea-generator':
        toolInstruction = `Brainstorm innovative, practical, and high-impact ideas. Group them by category with feasibility and unique selling points (USP).`;
        break;
      default:
        toolInstruction = `You are SmartAI Tamil. Provide a comprehensive, high-quality response to the user's request.`;
    }

    const fullPrompt = `Task: ${toolType}
Target Language: ${language === 'ta' ? 'Tamil (தமிழ்)' : 'English'}
Tone: ${tone}
Additional Options: ${JSON.stringify(options)}

User Request:
${prompt}`;

    const text = await generateWithFallback({
      contents: fullPrompt,
      systemInstruction: `You are SmartAI Tamil, an expert assistant for creative writing, professional communication, and productivity. Respond with exceptional quality and clarity in the specified language.\n${toolInstruction}`,
      temperature: 0.75,
    });

    return res.json({
      result: text,
      toolType,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Tool endpoint error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate content with AI tool',
    });
  }
});

// AI Image Generation Endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const { prompt, aspectRatio = '1:1', style = 'realistic' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Image prompt is required' });
    }

    // Enhance prompt with style modifiers
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed, 8k resolution, cinematic lighting`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      let imageUrl: string | null = null;
      let modelText = '';

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            break;
          }
          if (part.text) {
            modelText += part.text;
          }
        }
      }

      if (imageUrl) {
        return res.json({
          imageUrl,
          prompt,
          enhancedPrompt,
          aspectRatio,
        });
      } else {
        return res.status(422).json({
          error: 'Image generation completed without image data',
          message: modelText || 'The model returned text feedback rather than an image part.',
        });
      }
    } catch (genError: any) {
      const msg = genError?.message || '';
      console.warn('Image generation attempt error:', msg);

      // Honest explanation as requested in user prompt
      let explanation = 'Image generation service error.';
      if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('paid')) {
        explanation = 'Image generation with gemini-3.1-flash-lite-image requires a paid Google AI Studio API tier or billing-enabled project. Text, chat, writing, and translation features work completely without restriction.';
      } else if (msg.includes('404') || msg.includes('NOT_FOUND')) {
        explanation = 'The selected image generation model is not available in the current project region or API tier.';
      } else if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        explanation = 'Image generation quota exceeded. Please wait a moment or check your API quotas.';
      } else {
        explanation = `Image generation unavailable: ${msg}`;
      }

      return res.status(422).json({
        error: 'Image generation could not be completed',
        details: explanation,
        rawError: msg,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || 'Server error during image generation request',
    });
  }
});

// Setup server static & Vite middleware handling
async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve('dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartAI Tamil server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
