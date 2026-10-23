# SmartAI Tamil (ஸ்மார்ட் ஏஐ தமிழ்)

**SmartAI Tamil** is a modern, responsive bilingual AI Smart Assistant web application engineered for Android mobile phones, tablets, and desktop computers. It provides fluent, polite, and culturally intelligent assistance in both **Tamil (தமிழ்)** and **English**.

---

## 🌟 Key Features

### 1. 💬 AI Chat & Intelligence
- **Powered by Official Gemini API**: Seamless integration with server-side `@google/genai` utilizing `gemini-3.8-flash` with dynamic high-availability resilience via `gemini-3.1-flash-lite`.
- **Bilingual Conversations**: Native Tamil, Tanglish, and English conversational capabilities.
- **Copy & Retry**: 1-click response copying and conversation retry options.
- **Text-to-Speech (TTS)**: Built-in voice playback in Tamil (`ta-IN`) and English (`en-US`).
- **Markdown & Code Syntax Highlighting**: Clean formatting for code snippets with dedicated copy buttons, bullet points, and headers.

### 2. ✍️ AI Writing Assistant
- **Letters & Emails**: Formal leave letters, job inquiries, business correspondence.
- **Social Media Captions**: Engaging captions with hashtags and emojis.
- **Business Advertisements**: High-converting marketing copy with strong value propositions.
- **YouTube Scripts**: Video hooks, content outlines, and call-to-actions.
- **Stories & Articles**: Creative narratives and well-researched essays.
- **Professional Messages**: Polite reminders, client updates, and workplace chats.
- **Bilingual Translation**: Context-aware Tamil-to-English and English-to-Tamil translation.

### 3. 🎨 AI Image Generation Studio
- Interactive prompt builder supporting aspect ratios (`1:1`, `16:9`, `9:16`, `4:3`) and art styles (Photorealistic, Cinematic, Digital Art, 3D Render, Anime).
- Connects to `gemini-3.1-flash-lite-image`.
- Transparent feedback: Explains API quota and billing requirements clearly when unpaid tiers apply.
- Gallery with 1-click PNG downloads and full-size zoom modal.

### 4. 🎙️ Voice Input (Speech Recognition)
- Hands-free voice typing using the browser Web Speech API.
- Native speech recognition in Tamil (`ta-IN`) and English (`en-US`).
- Graceful permission handling and fallback for unsupported browsers.

### 5. 🗂️ Chat History & Data Privacy
- Conversations persist securely on the user's device via `localStorage`.
- Rename, delete individual chats, or clear history with confirmation.
- Export chat conversations and restore easily.

### 6. 📱 Progressive Web App (PWA)
- Installable on Android (via Chrome/Edge prompt), iOS (guided Safari "Add to Home Screen" sheet), and Desktop.
- Standalone display mode with custom theme styling (`#0f172a`), icons (192px, 512px, maskable), and offline network indicator.

### 7. ⚙️ Settings & System Health
- Instant one-click toggle between Tamil and English.
- Dark & Light mode toggle.
- Real-time API configuration status indicator (verifies backend key connectivity without exposing secret keys).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend**: Node.js 22, Express, `@google/genai` SDK v2.4+
- **PWA**: `vite-plugin-pwa`, Service Worker, Web App Manifest
- **Audio / Speech**: Web Speech Recognition API & Web SpeechSynthesis API

---

## 🔒 Security Architecture

1. **Server-Side API Key Storage**: The private `GEMINI_API_KEY` is kept strictly on the Node.js server (`server.ts`) and never exposed in client bundles or browser network payloads.
2. **Input Validation**: Text length and message formatting are validated prior to invoking model endpoints.
3. **Local Privacy**: User conversations remain stored within the client device's browser `localStorage`, ensuring data sovereignty.

---

## 🚀 Running & Developing Locally

### 1. Prerequisites
- Node.js (v20+ recommended, v22 supported)
- A Google Gemini API key from Google AI Studio

### 2. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):

```bash
GEMINI_API_KEY="your-google-ai-studio-api-key"
APP_URL="http://localhost:3000"
PORT=3000
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build & Deployment
```bash
# Build client assets
npm run build

# Start production server
npm run start
```

---

## 📲 Installing as a PWA

- **Android (Chrome)**: Tap the **"செயலியை நிறுவு (PWA)"** button in the top navbar or browser banner to install the standalone app icon to your launcher.
- **iPhone / iPad (Safari)**: Tap the **Share** button at the bottom of Safari, scroll down, and select **"Add to Home Screen"**.
- **Desktop (Chrome/Edge)**: Click the install icon in the address bar or the install button in the app navbar.
