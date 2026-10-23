import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  newChat: string;
  chatHistory: string;
  noChatsYet: string;
  localDataNote: string;
  clearHistory: string;
  deleteConfirm: string;
  rename: string;
  delete: string;
  save: string;
  cancel: string;
  edit: string;
  copied: string;
  copy: string;
  retry: string;
  readAloud: string;
  stopAudio: string;
  typePlaceholder: string;
  voiceListening: string;
  micPermissionDenied: string;
  speechNotSupported: string;
  send: string;
  thinking: string;
  dashboard: string;
  tools: string;
  writingAssistant: string;
  translation: string;
  codingHelp: string;
  ideaGenerator: string;
  studyAssistant: string;
  businessCreator: string;
  imageGen: string;
  settings: string;
  languageSelect: string;
  themeToggle: string;
  darkMode: string;
  lightMode: string;
  apiStatus: string;
  apiKeyConfigured: string;
  apiKeyMissing: string;
  privacyTitle: string;
  privacyText: string;
  installApp: string;
  installAppIos: string;
  close: string;
  emptyChatHeading: string;
  emptyChatSubheading: string;
  suggestionsTitle: string;
  promptLetter: string;
  promptTamilCode: string;
  promptTranslate: string;
  promptStory: string;
  promptStudy: string;
  imageGenTitle: string;
  imageGenDesc: string;
  imagePromptPlaceholder: string;
  generateImage: string;
  generatingImage: string;
  aspectRatio: string;
  style: string;
  downloadImage: string;
  imageDisclaimer: string;
  writingToolHeader: string;
  selectCategory: string;
  generateContent: string;
  generatingContent: string;
  resultTitle: string;
  toneLabel: string;
  online: string;
  offline: string;
  offlineMsg: string;
  // Download additions
  downloadText: string;
  downloadChat: string;
  downloadSuccess: string;
  downloadFailed: string;
  downloadFormat: string;
  downloadResponse: string;
  exportChatTooltip: string;
  downloading: string;
  // Media & App download additions
  myDownloads: string;
  downloadAndroidApp: string;
  videoGen: string;
  videoGenDesc: string;
  downloadVideo: string;
  downloadPdf: string;
  downloadJson: string;
  apkNotReady: string;
  apkReady: string;
  buildSteps: string;
  openPreview: string;
  downloadAgain: string;
  clearDownloads: string;
  noDownloadsYet: string;
  filterAll: string;
  filterImages: string;
  filterVideos: string;
  filterDocs: string;
  filterChats: string;
  androidGuideTitle: string;
}

export const translations: Record<Language, Translations> = {
  ta: {
    appName: 'ஸ்மார்ட் ஏஐ தமிழ்',
    appSubtitle: 'உங்கள் நவீன செயற்கை நுண்ணறிவு உதவியாளர்',
    newChat: '+ புதிய உரையாடல்',
    chatHistory: 'முந்தைய உரையாடல்கள்',
    noChatsYet: 'உரையாடல்கள் ஏதுமில்லை. புதிய உரையாடலைத் தொடங்கவும்.',
    localDataNote: 'உங்கள் உரையாடல்கள் உங்கள் சாதனத்தில் மட்டுமே பாதுகாப்பாக சேமிக்கப்படுகின்றன.',
    clearHistory: 'அனைத்து உரையாடல்களையும் நீக்கு',
    deleteConfirm: 'இந்த உரையாடலை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
    rename: 'பெயர் மாற்றம்',
    delete: 'நீக்கு',
    save: 'சேமி',
    cancel: 'ரத்து',
    edit: 'திருத்து',
    copied: 'நகலெடுக்கப்பட்டது!',
    copy: 'நகலெடு',
    retry: 'மீண்டும் முயற்சி',
    readAloud: 'வாசித்துக்காட்டு',
    stopAudio: 'நிறுத்து',
    typePlaceholder: 'தமிழிலோ ஆங்கிலத்திலோ உங்கள் கேள்வியைக் கேளுங்கள்... (Enter அழுத்தவும்)',
    voiceListening: 'கேட்கிறது... பேசுங்கள்',
    micPermissionDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டுள்ளது. உலாவி அமைப்புகளில் அனுமதியை வழங்கவும்.',
    speechNotSupported: 'உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை.',
    send: 'அனுப்பு',
    thinking: 'ஸ்மார்ட் ஏஐ சிந்திக்கிறது...',
    dashboard: 'டாஷ்போர்டு',
    tools: 'ஸ்மார்ட் கருவிகள்',
    writingAssistant: 'எழுத்து உதவியாளர்',
    translation: 'மொழிபெயர்ப்பு',
    codingHelp: 'நிரலாக்க உதவி',
    ideaGenerator: 'யோசனை உருவாக்கி',
    studyAssistant: 'கல்வி வழிகாட்டி',
    businessCreator: 'வணிக உள்ளடக்கம்',
    imageGen: 'பட உருவாக்கம்',
    settings: 'அமைப்புகள்',
    languageSelect: 'மொழி தேர்வு (Language)',
    themeToggle: 'தோற்றம் (Theme)',
    darkMode: 'இருள் பயன்முறை (Dark)',
    lightMode: 'வெளிச்ச பயன்முறை (Light)',
    apiStatus: 'API நிலை',
    apiKeyConfigured: 'Gemini API இயக்கத்தில் உள்ளது',
    apiKeyMissing: 'Gemini API சாவி தேவைப்படுகிறது',
    privacyTitle: 'தனியுரிமை மற்றும் பாதுகாப்பு',
    privacyText: 'உங்கள் தனியுரிமை மதிக்கப்படுகிறது. உங்கள் உரையாடல்கள் உங்கள் சாதனத்தின் LocalStorage-ல் மட்டுமே வைக்கப்படுகின்றன. வெளிப்புற சேவையகங்களில் உங்கள் அனுமதியின்றி தனிப்பட்ட தரவு சேமிக்கப்படுவதில்லை.',
    installApp: 'செயலியை நிறுவு (PWA)',
    installAppIos: 'iOS-ல் நிறுவு',
    close: 'மூடு',
    emptyChatHeading: 'வணக்கம்! நான் உங்கள் ஸ்மார்ட் ஏஐ தமிழ்',
    emptyChatSubheading: 'எழுத்துப்பணி, மொழிபெயர்ப்பு, நிரலாக்கம், கல்வி மற்றும் பல பணிகளுக்கு நான் உங்களுக்கு உதவ தயார்.',
    suggestionsTitle: 'மாதிரி கேள்விகள் (தட்டவும்):',
    promptLetter: 'பணியிட விடுப்புக்கான முறையான விண்ணப்பக் கடிதம் எழுதி கொடுங்கள்',
    promptTamilCode: 'React மற்றும் TypeScript-ல் ஒரு எளிய Counter component எழுதி விளக்குங்கள்',
    promptTranslate: 'ஆங்கிலத்தை நேர்த்தியான தமிழுக்கு மொழிபெயர்க்க உதவும் வழிகாட்டுதல் கூறு',
    promptStory: 'கிராமத்து பின்னணியில் ஒரு சுவாரஸ்யமான அறிவியல் சிறுகதை எழுதுங்கள்',
    promptStudy: 'செயற்கை நுண்ணறிவு (AI) எவ்வாறு செயல்படுகிறது என்பதை எளிமையாக விளக்குங்கள்',
    imageGenTitle: 'AI பட உருவாக்கம்',
    imageGenDesc: 'நீங்கள் கற்பனை செய்யும் காட்சியை விவரிக்கவும், AI அதை ஒரு அழகிய படமாக மாற்றும்.',
    imagePromptPlaceholder: 'எ.கா: futuristic Chennai city with flying cars at sunset, photorealistic, neon lights...',
    generateImage: 'படத்தை உருவாக்கு',
    generatingImage: 'படம் உருவாகிறது...',
    aspectRatio: 'பட விகிதம் (Aspect Ratio)',
    style: 'வடிவமைப்பு பாணி (Style)',
    downloadImage: 'படத்தைப் பதிவிறக்கு',
    imageDisclaimer: 'பட உருவாக்கம் Gemini 3.1 Flash Image மாதிரி மூலம் இயக்கப்படுகிறது. API கட்டணத் திட்டம் அல்லது ஒதுக்கீடு இல்லையெனில், தெளிவான வழிகாட்டல் திரையில் காண்பிக்கப்படும்.',
    writingToolHeader: 'AI எழுத்து மற்றும் உள்ளடக்க உதவியாளர்',
    selectCategory: 'பிரிவைத் தேர்ந்தெடுக்கவும்',
    generateContent: 'உள்ளடக்கத்தை உருவாக்கு',
    generatingContent: 'உருவாக்கப்படுகிறது...',
    resultTitle: 'உருவாக்கப்பட்ட உள்ளடக்கம்:',
    toneLabel: 'எழுத்து தொனி (Tone):',
    online: 'இணையம் இணைக்கப்பட்டுள்ளது',
    offline: 'இணைய இணைப்பு இல்லை',
    offlineMsg: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். இணைய இணைப்பைச் சரிபார்க்கவும்.',
    // Download additions
    downloadText: 'பதிவிறக்கு (.txt)',
    downloadChat: 'உரையாடலை பதிவிறக்கு (.txt)',
    downloadSuccess: 'கோப்பு வெற்றிகரமாக பதிவிறக்கப்பட்டது!',
    downloadFailed: 'பதிவிறக்குவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    downloadFormat: 'வடிவம்',
    downloadResponse: 'பதிலை பதிவிறக்கு (.txt)',
    exportChatTooltip: 'இந்த முழு உரையாடலையும் .txt கோப்பாக பதிவிறக்கவும்',
    downloading: 'பதிவிறங்குகிறது...',
    // Media & Android App additions
    myDownloads: 'என் பதிவிறக்கங்கள்',
    downloadAndroidApp: 'Android செயலி (APK)',
    videoGen: 'AI வீடியோ ஸ்டுடியோ',
    videoGenDesc: 'AI மூலம் உயர் தர வீடியோ காட்சிகளை உருவாக்குங்கள் மற்றும் MP4/WEBM வடிவில் பதிவிறக்குங்கள்.',
    downloadVideo: 'வீடியோவை பதிவிறக்கு',
    downloadPdf: 'PDF ஆவணமாக பதிவிறக்கு',
    downloadJson: 'JSON தரவாக பதிவிறக்கு',
    apkNotReady: 'Android APK இன்னும் தயாராகவில்லை',
    apkReady: 'Android APK தயார் - பதிவிறக்கலாம்',
    buildSteps: 'Android APK உருவாக்கும் எளிய வழிமுறைகள்',
    openPreview: 'முன்னோட்டம்',
    downloadAgain: 'மீண்டும் பதிவிறக்கு',
    clearDownloads: 'பதிவிறக்க வரலாற்றை நீக்கு',
    noDownloadsYet: 'இதுவரை பதிவிறக்கங்கள் ஏதுமில்லை. புதிய படங்கள், வீடியோக்கள் அல்லது அரட்டைகளை பதிவிறக்கலாம்.',
    filterAll: 'அனைத்தும்',
    filterImages: 'படங்கள்',
    filterVideos: 'வீடியோக்கள்',
    filterDocs: 'ஆவணங்கள்',
    filterChats: 'அரட்டைகள்',
    androidGuideTitle: 'Android APK பேக்கேஜிங் வழிகாட்டி',
  },
  en: {
    appName: 'SmartAI Tamil',
    appSubtitle: 'Your Intelligent Bilingual AI Assistant',
    newChat: '+ New Chat',
    chatHistory: 'Chat History',
    noChatsYet: 'No previous conversations yet. Start a new chat.',
    localDataNote: 'Your chat history is securely stored on this device only.',
    clearHistory: 'Clear All Chats',
    deleteConfirm: 'Are you sure you want to delete this conversation?',
    rename: 'Rename',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    copied: 'Copied to clipboard!',
    copy: 'Copy',
    retry: 'Retry',
    readAloud: 'Read Aloud',
    stopAudio: 'Stop',
    typePlaceholder: 'Ask a question in Tamil or English... (Press Enter)',
    voiceListening: 'Listening... Speak now',
    micPermissionDenied: 'Microphone permission denied. Please allow microphone in browser settings.',
    speechNotSupported: 'Speech recognition is not supported in this browser.',
    send: 'Send',
    thinking: 'SmartAI is thinking...',
    dashboard: 'Dashboard',
    tools: 'Smart Tools',
    writingAssistant: 'AI Writing Assistant',
    translation: 'Translation',
    codingHelp: 'Coding Help',
    ideaGenerator: 'Idea Generator',
    studyAssistant: 'Study Assistant',
    businessCreator: 'Business Content',
    imageGen: 'Image Generation',
    settings: 'Settings',
    languageSelect: 'Language Selection',
    themeToggle: 'Appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    apiStatus: 'API Status',
    apiKeyConfigured: 'Gemini API Active & Ready',
    apiKeyMissing: 'Gemini API Key Required',
    privacyTitle: 'Privacy & Security',
    privacyText: 'Your privacy is paramount. Your conversation history is stored strictly in your browser local storage. No secret keys are exposed to the client.',
    installApp: 'Install App (PWA)',
    installAppIos: 'Install on iOS',
    close: 'Close',
    emptyChatHeading: 'Hello! I am SmartAI Tamil',
    emptyChatSubheading: 'How can I assist you today? I speak fluent Tamil and English for writing, coding, analysis, and creativity.',
    suggestionsTitle: 'Try asking:',
    promptLetter: 'Draft a professional sick leave email to my project manager',
    promptTamilCode: 'Write a React TypeScript counter component with clear comments',
    promptTranslate: 'Explain how to accurately translate formal English documents into Tamil',
    promptStory: 'Write a futuristic sci-fi short story set in Chennai with a thrilling twist',
    promptStudy: 'Explain quantum computing basics with simple everyday analogies',
    imageGenTitle: 'AI Image Generator',
    imageGenDesc: 'Describe the scene you imagine, and AI will turn it into a striking visual artwork.',
    imagePromptPlaceholder: 'e.g. Traditional South Indian temple architecture at dawn with golden sunlight and misty hills...',
    generateImage: 'Generate Image',
    generatingImage: 'Generating Image...',
    aspectRatio: 'Aspect Ratio',
    style: 'Art Style',
    downloadImage: 'Download Image',
    imageDisclaimer: 'Image generation uses Gemini 3.1 Flash Image model. If paid quotas or permissions apply, clear details are displayed.',
    writingToolHeader: 'AI Writing & Content Creator',
    selectCategory: 'Select Writing Task',
    generateContent: 'Generate Content',
    generatingContent: 'Generating...',
    resultTitle: 'Generated Content:',
    toneLabel: 'Tone of Voice:',
    online: 'Online',
    offline: 'Offline',
    offlineMsg: 'You are currently offline. Check your internet connection.',
    // Download additions
    downloadText: 'Download (.txt)',
    downloadChat: 'Export Chat (.txt)',
    downloadSuccess: 'File downloaded successfully!',
    downloadFailed: 'Download failed. Please try again.',
    downloadFormat: 'Format',
    downloadResponse: 'Download Response (.txt)',
    exportChatTooltip: 'Export this entire conversation as a readable .txt file',
    downloading: 'Downloading...',
    // Media & Android App additions
    myDownloads: 'My Downloads',
    downloadAndroidApp: 'Download Android App (APK)',
    videoGen: 'AI Video Studio',
    videoGenDesc: 'Create high-definition AI animated motion clips and download in MP4 / WEBM formats.',
    downloadVideo: 'Download Video',
    downloadPdf: 'Download as PDF',
    downloadJson: 'Download as JSON',
    apkNotReady: 'Android APK is not ready yet',
    apkReady: 'Android APK Ready for Download',
    buildSteps: 'Android APK Build Instructions',
    openPreview: 'Open Preview',
    downloadAgain: 'Download Again',
    clearDownloads: 'Clear History',
    noDownloadsYet: 'No files downloaded in this session yet. Generate images, videos, or chats to download them here.',
    filterAll: 'All',
    filterImages: 'Images',
    filterVideos: 'Videos',
    filterDocs: 'Documents',
    filterChats: 'Chats',
    androidGuideTitle: 'Android APK Packaging Guide',
  },
};
