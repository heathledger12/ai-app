import React from 'react';
import {
  MessageSquare,
  PenTool,
  Languages,
  Code2,
  Lightbulb,
  GraduationCap,
  TrendingUp,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Language, ToolType } from '../types';
import { translations } from '../utils/translations';

interface ToolsDashboardViewProps {
  language: Language;
  onNavigateToTool: (tool: ToolType, starterPrompt?: string) => void;
}

export const ToolsDashboardView: React.FC<ToolsDashboardViewProps> = ({
  language,
  onNavigateToTool,
}) => {
  const t = translations[language];

  const tools = [
    {
      id: 'chat' as ToolType,
      title: language === 'ta' ? 'AI உரையாடல் (Chat)' : 'AI Smart Chat',
      desc: language === 'ta'
        ? 'இயல்பான தமிழ் மற்றும் ஆங்கிலத்தில் உடனடி பதில்கள், ஆலோசனைகள் மற்றும் விளக்கங்கள்.'
        : 'Fluent natural conversation in Tamil & English with Gemini 3.8 Flash intelligence.',
      icon: MessageSquare,
      color: 'from-blue-600 to-indigo-600',
      samples: [
        language === 'ta' ? 'தமிழ் இலக்கியத்தின் பெருமைகள் பற்றி கூறு' : 'Explain key milestones of quantum physics',
        language === 'ta' ? 'தினசரி உற்பத்தி திறனை அதிகரிக்கும் 5 வழிகள்' : '5 productivity habits for remote software engineers',
      ],
    },
    {
      id: 'writing' as ToolType,
      title: language === 'ta' ? 'எழுத்து உதவியாளர் (Writing)' : 'AI Writing Assistant',
      desc: language === 'ta'
        ? 'மின்னஞ்சல்கள், கடிதங்கள், YouTube ஸ்கிரிப்டுகள் மற்றும் கட்டுரைகள் உருவாக்குங்கள்.'
        : 'Generate professional emails, compelling social captions, ads, and video scripts.',
      icon: PenTool,
      color: 'from-indigo-600 to-purple-600',
      samples: [
        language === 'ta' ? 'வேலை விண்ணப்பத்திற்கான கவர் லெட்டர்' : 'Job application cover letter for React developer',
        language === 'ta' ? 'Instagram-ல் வைரலாகும் ஆடை பிராண்ட் கேப்ஷன்' : 'Viral Instagram caption with emojis for fashion brand',
      ],
    },
    {
      id: 'translation' as ToolType,
      title: language === 'ta' ? 'இருமொழி மொழிபெயர்ப்பு (Translation)' : 'Bilingual Translation',
      desc: language === 'ta'
        ? 'தமிழ் முதல் ஆங்கிலம் மற்றும் ஆங்கிலம் முதல் தமிழுக்கு நேர்த்தியான மொழிபெயர்ப்பு.'
        : 'High-fidelity contextual translation between Tamil and English.',
      icon: Languages,
      color: 'from-purple-600 to-pink-600',
      samples: [
        language === 'ta' ? 'வணிக ஒப்பந்தங்களை ஆங்கிலத்திலிருந்து தமிழுக்கு மொழிபெயர்க்க' : 'Translate technical document to fluent Tamil',
        language === 'ta' ? 'பழமொழிகளின் ஆங்கில இணையான அர்த்தங்கள்' : 'Tamil proverbs with accurate English idioms',
      ],
    },
    {
      id: 'coding' as ToolType,
      title: language === 'ta' ? 'நிரலாக்க உதவி (Coding Help)' : 'Coding & Tech Mentor',
      desc: language === 'ta'
        ? 'JavaScript, Python, React, SQL, பிழைதிருத்தம் மற்றும் கட்டிடக்கலை வழிகாட்டல்.'
        : 'Clean code snippets, algorithmic logic, bug fixing, and modern web best practices.',
      icon: Code2,
      color: 'from-emerald-600 to-teal-600',
      samples: [
        language === 'ta' ? 'React-ல் Custom Hook உருவாக்குவது எப்படி?' : 'Build an accessible debounce search Hook in React',
        language === 'ta' ? 'Python-ல் REST API உருவாக்குவதற்கான வழிகாட்டல்' : 'Python FastAPI starter with JWT authentication',
      ],
    },
    {
      id: 'study' as ToolType,
      title: language === 'ta' ? 'கல்வி வழிகாட்டி (Study Assistant)' : 'Study & Exam Mentor',
      desc: language === 'ta'
        ? 'கடினமான பாடக் கருத்துக்களை எளிமையாகப் புரிந்து கொள்ளவும், வினாடி வினாக்கள் பெறவும்.'
        : 'Simplified explanations, flashcard notes, formulas, and mock test quizzes.',
      icon: GraduationCap,
      color: 'from-amber-600 to-orange-600',
      samples: [
        language === 'ta' ? 'ஒளிச்சேர்க்கை (Photosynthesis) எளிய விளக்கம்' : 'Thermodynamics laws explained with real-world examples',
        language === 'ta' ? 'TNPSC & போட்டித் தேர்வுகளுக்கான முக்கிய குறிப்புகள்' : 'Key general knowledge tips for competitive exams',
      ],
    },
    {
      id: 'ideas' as ToolType,
      title: language === 'ta' ? 'யோசனை உருவாக்கி (Idea Generator)' : 'Creative Idea Generator',
      desc: language === 'ta'
        ? 'தொழில் தொடக்கம், YouTube சேனல் கருத்துக்கள், புதிய திட்டங்கள் சிந்திக்க.'
        : 'Brainstorm startup concepts, content creation ideas, and innovative solutions.',
      icon: Lightbulb,
      color: 'from-yellow-500 to-amber-600',
      samples: [
        language === 'ta' ? '2026-ல் தமிழ்நாட்டில் தொடங்கக்கூடிய AI தொழில் யோசனைகள்' : 'High-potential SaaS ideas for local businesses',
        language === 'ta' ? 'மாணவர்களுக்கான சிறந்த கல்லூரி இறுதி ஆண்டு ப்ராஜெக்ட்ஸ்' : 'Final year computer science project concepts',
      ],
    },
    {
      id: 'business' as ToolType,
      title: language === 'ta' ? 'வணிக உள்ளடக்கம் (Business Creator)' : 'Business Content Creator',
      desc: language === 'ta'
        ? 'விற்பனை கடிதங்கள், விளம்பர வாசகங்கள், பிட்ச் டெக் மற்றும் வணிக திட்டங்கள்.'
        : 'Marketing campaigns, client proposals, pitch decks, and strategic memos.',
      icon: TrendingUp,
      color: 'from-rose-600 to-pink-600',
      samples: [
        language === 'ta' ? 'புதிய உணவகத்திற்கான விளம்பர உத்தி மற்றும் தள்ளுபடி சலுகை' : 'Strategic B2B cold email outreach sequence',
        language === 'ta' ? 'முதலீட்டாளர்களுக்கு சமர்ப்பிக்கும் பிட்ச் டெக் சுருக்கம்' : 'Investor pitch executive summary for tech startup',
      ],
    },
    {
      id: 'image' as ToolType,
      title: language === 'ta' ? 'AI பட உருவாக்கம் (Image Gen)' : 'AI Image Studio',
      desc: language === 'ta'
        ? 'உரையை வண்ணமயமான காட்சிகளாகவும் கலைப்படைப்புகளாகவும் மாற்றவும்.'
        : 'Turn text descriptions into visually captivating AI images & illustrations.',
      icon: ImageIcon,
      color: 'from-cyan-600 to-blue-600',
      samples: [
        language === 'ta' ? 'பாரம்பரிய தஞ்சாவூர் ஓவிய பாணியில் ஒரு விநாயகர் சிலை' : 'Cyberpunk Chennai skyline at midnight with neon lights',
        language === 'ta' ? 'பசுமையான தென்னை மரங்கள் சூழ்ந்த அமைதியான கிராமத்து விடியல்' : 'Minimalist 3D isometric workspace with holographic displays',
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-950 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/30 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{language === 'ta' ? 'அனைத்து AI கருவிகள் ஒரே இடத்தில்' : 'All-in-One AI Productivity Suite'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'ta'
              ? 'உங்கள் அன்றாட பணிகளுக்கு அதிவேக ஸ்மார்ட் கருவிகள்'
              : 'Empower your daily workflows with SmartAI Tamil'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'ta'
              ? 'உரையாடல், எழுத்து, மொழிபெயர்ப்பு, நிரலாக்கம், கல்வி மற்றும் பட உருவாக்கம் போன்ற கருவிகளை உடனடியாகப் பயன்படுத்துங்கள்.'
              : 'Select a specialized module below to launch tailored AI workflows powered by modern Gemini intelligence.'}
          </p>
        </div>

        {/* Ambient background glow circle */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Grid of Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-indigo-500/5 transition-all duration-200"
            >
              <div>
                {/* Header with Icon and Launch Button */}
                <div className="flex items-start justify-between mb-3.5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr ${tool.color} text-white shadow-md`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <button
                    onClick={() => onNavigateToTool(tool.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'திறக்கவும்' : 'Open'}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                  {tool.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {tool.desc}
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {language === 'ta' ? 'மாதிரி கேள்விகள்:' : 'Quick Prompts:'}
                </span>
                {tool.samples.map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => onNavigateToTool(tool.id, sample)}
                    className="flex w-full items-center justify-between text-left rounded-xl bg-slate-950/60 px-2.5 py-1.5 text-[11px] text-slate-300 hover:bg-indigo-950/60 hover:text-indigo-200 transition cursor-pointer"
                  >
                    <span className="truncate pr-2">{sample}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
