import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  Send, 
  CheckCircle2, 
  Globe, 
  Scale, 
  ShieldCheck, 
  Leaf,
  Sparkles,
  Users,
  Terminal,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react';
import { runAmonoCouncil, CouncilResult } from './services/gemini';

const AmonoLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg 
    viewBox="235 160 330 330" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="arcIndic" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#FCD34D" />
      </linearGradient>
      <linearGradient id="arcWest" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="arcUbuntu" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
      <linearGradient id="arcIndig" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <g>
      <path d="M 330 200 C 370 170, 430 170, 470 200 C 500 225, 485 270, 430 290 C 390 305, 360 270, 330 200 Z" fill="url(#arcIndic)" opacity="0.95" />
      <path d="M 525 255 C 555 295, 555 355, 525 395 C 500 425, 455 410, 435 355 C 420 315, 455 285, 525 255 Z" fill="url(#arcWest)" opacity="0.95" />
      <path d="M 470 450 C 430 480, 370 480, 330 450 C 300 425, 315 380, 370 360 C 410 345, 440 380, 470 450 Z" fill="url(#arcUbuntu)" opacity="0.95" />
      <path d="M 275 395 C 245 355, 245 295, 275 255 C 300 225, 345 240, 365 295 C 380 335, 345 365, 275 395 Z" fill="url(#arcIndig)" opacity="0.95" />
    </g>
    <circle cx="400" cy="325" r="22" fill="#080C14" stroke="#475569" strokeWidth="3" />
    <circle cx="400" cy="325" r="8" fill="#F8FAFC" />
  </svg>
);

interface Agent {
  id: string;
  name: string;
  tradition: string;
  school: string;
  avatarBg: string;
  accentColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  stanceCompact: string;
  stanceAnalytic: string;
}

const COUNCIL_AGENTS: Agent[] = [
  {
    id: 'indic',
    name: 'Dharmic Sage',
    tradition: 'Indic Epistemology',
    school: 'Svadharma & Rta',
    avatarBg: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    icon: Compass,
    stanceCompact: 'Prioritizes filial obligation as inescapable spiritual duty (Svadharma) and karmic debt (Rna).',
    stanceAnalytic: 'From the Vedic and Dharmic paradigm, kinship care is an ontological responsibility embedded in cosmic harmony (Rta). Self-actualization cannot come at the expense of filial abandonment.'
  },
  {
    id: 'collectivist',
    name: 'Communal Guardian',
    tradition: 'Collectivist Ethics',
    school: 'Social Cohesion',
    avatarBg: 'from-blue-500 to-indigo-600',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    icon: Scale,
    stanceCompact: 'Upholds relational interdependence and family stability over geographic relocation.',
    stanceAnalytic: 'Collectivist frameworks evaluate agency through network equilibrium. Unilateral career migration disrupts inter-generational care systems and destabilizes familial support structures.'
  },
  {
    id: 'indigenous',
    name: 'Biocentric Elder',
    tradition: 'Indigenous Epistemology',
    school: 'Kinship Reciprocity',
    avatarBg: 'from-emerald-500 to-teal-600',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    icon: Leaf,
    stanceCompact: 'Anchors duty in place-based living relations and generational stewardship.',
    stanceAnalytic: 'Indigenous relational accountability demands reciprocal honor to those who nurtured you. Decision-making is situated in community stewardship rather than unconstrained extraction of personal utility.'
  },
  {
    id: 'western',
    name: 'Liberal Ethicist',
    tradition: 'Western Liberalism',
    school: 'Autonomy & Rights',
    avatarBg: 'from-purple-500 to-pink-600',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    icon: Globe,
    stanceCompact: 'Champions individual autonomy, freedom of mobility, and professional self-actualization.',
    stanceAnalytic: 'Utilitarian and rights-based traditions preserve individual sovereignty. An individual holds the procedural right to pursue career self-actualization without obligatory self-abnegation.'
  }
];

const PRESETS = [
  { id: 1, label: "Filial Duty vs. Relocation", query: "Should an individual prioritize familial care obligations over personal career relocation?" },
  { id: 2, label: "Indigenous Land vs. Green Grid", query: "Should sovereign Indigenous ancestral territory be repurposed for national green energy infrastructure?" },
  { id: 3, label: "Biometric Surveillance vs. Safety", query: "Is mass algorithmic biometric surveillance justified to prevent imminent civil unrest?" },
  { id: 4, label: "CRISPR vs. Cosmic Dharma", query: "Does human germline genetic modification violate natural cosmic balance (Rta)?" },
  { id: 5, label: "AI Automation vs. Traditional Craft", query: "How should the automation of indigenous artisanal craft patterns by generative AI models be governed?" }
];

export const App: React.FC = () => {
  const [query, setQuery] = useState(PRESETS[0].query);
  const [mode, setMode] = useState<'compact' | 'analytic'>('compact');
  const [phase, setPhase] = useState<'idle' | 'deliberating' | 'synthesizing' | 'complete'>('idle');
  const [activeTab, setActiveTab] = useState<'synthesis' | 'agents'>('synthesis');
  const [copied, setCopied] = useState(false);
  const [streamedSynthesis, setStreamedSynthesis] = useState('');
  const [dynamicAgents, setDynamicAgents] = useState(COUNCIL_AGENTS);

  const handleStartCouncil = async () => {
    if (!query.trim()) return;

    setPhase('deliberating');
    setStreamedSynthesis('');
    setActiveTab('agents');

    try {
      const result: CouncilResult = await runAmonoCouncil(query, mode);

      setDynamicAgents(prev =>
        prev.map(agent => {
          const match = result.agents.find(a => a.id === agent.id);
          return match
            ? { ...agent, stanceCompact: match.stance, stanceAnalytic: match.stance }
            : agent;
        })
      );

      setPhase('synthesizing');
      setActiveTab('synthesis');

      let i = 0;
      const interval = setInterval(() => {
        if (i <= result.synthesis.length) {
          setStreamedSynthesis(result.synthesis.slice(0, i));
          i += 4;
        } else {
          clearInterval(interval);
          setPhase('complete');
        }
      }, 15);
    } catch (err) {
      console.error("Deliberation error:", err);
      setStreamedSynthesis("An error occurred connecting to the epistemic engine. Check your API key configuration.");
      setPhase('complete');
    }
  };

  const copySynthesis = () => {
    navigator.clipboard.writeText(streamedSynthesis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header / Council HUD */}
      <header className="border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center p-1.5 shadow-lg shadow-indigo-500/20">
              <AmonoLogo />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base md:text-lg tracking-tight text-white">
                  Amono AI <span className="text-slate-400 font-normal">|</span> Council of Epistemic Minds
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  Pluralistic Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">4-Quadrant Epistemic Governance & Deliberation Network</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-mono text-[11px]">4 Agents Active</span>
            </div>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setMode('compact')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${mode === 'compact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Compact (≤100w)
              </button>
              <button
                type="button"
                onClick={() => setMode('analytic')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${mode === 'analytic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Analytic (≤250w)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chamber */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Council Agent Roster Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dynamicAgents.map((agent) => {
            const Icon = agent.icon;
            const isSpeaking = phase === 'deliberating';
            return (
              <div 
                key={agent.id}
                className={`relative rounded-xl p-4 bg-slate-900/60 border ${agent.borderColor} backdrop-blur-md transition-all duration-300 ${
                  isSpeaking ? 'ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.avatarBg} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{agent.name}</h3>
                      <div className={`text-[10px] font-mono ${agent.accentColor}`}>{agent.school}</div>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{agent.tradition}</div>
              </div>
            );
          })}
        </div>

        {/* Preset Dilemma Queries */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 uppercase shrink-0">Test Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => { setQuery(preset.query); setPhase('idle'); }}
              className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
                query === preset.query 
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-medium' 
                  : 'bg-slate-900/40 border-white/[0.06] text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Prompt Chamber */}
        <section className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Inquiry for Amono Council Deliberation
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              Target Budget: {mode === 'compact' ? '≤ 100 words' : '≤ 250 words'}
            </span>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="w-full bg-[#04060a] border border-white/[0.08] rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition resize-none"
            placeholder="Type any contentious socio-ethical inquiry here..."
          />

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cross-Paradigm Equilibrium Synthesis
            </div>

            <button
              type="button"
              onClick={handleStartCouncil}
              disabled={phase === 'deliberating' || !query.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              {phase === 'deliberating' ? 'Amono Council Deliberating...' : 'Convene Amono Council'}
            </button>
          </div>
        </section>

        {/* Deliberation Chamber Results */}
        {phase !== 'idle' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('synthesis')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                    activeTab === 'synthesis' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Synthesized Consensus
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('agents')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                    activeTab === 'agents' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Individual Agent Positions
                </button>
              </div>

              {activeTab === 'synthesis' && phase === 'complete' && (
                <button
                  type="button"
                  onClick={copySynthesis}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-3 py-1 rounded-lg border border-white/[0.08] transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Consensus'}
                </button>
              )}
            </div>

            {/* TAB 1: Consensus Synthesis */}
            {activeTab === 'synthesis' && (
              <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                      Amono AI Synthesis Output • Mode: {mode.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Dialectical Equilibrium Verified
                  </span>
                </div>

                <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                  {streamedSynthesis}
                  {phase === 'synthesizing' && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse" />}
                </p>
              </div>
            )}

            {/* TAB 2: Individual Agent Cards */}
            {activeTab === 'agents' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicAgents.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <div 
                      key={agent.id}
                      className={`rounded-xl bg-slate-900/40 border ${agent.borderColor} p-5 space-y-3`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.avatarBg} flex items-center justify-center text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                          <span className={`text-[11px] font-mono ${agent.accentColor}`}>{agent.tradition}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        "{mode === 'compact' ? agent.stanceCompact : agent.stanceAnalytic}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

          </section>
        )}

      </main>

      {/* Official Contact Footer */}
      <footer className="mt-12 py-6 text-center border-t border-slate-800 text-sm text-slate-400">
        <p className="mb-2">
          Have inquiries, feedback, or collaboration proposals?
        </p>
        <p>
          Contact:{' '}
          <a 
            href="mailto:amonoai.official@gmail.com" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono underline"
          >
            amonoai.official@gmail.com
          </a>
        </p>
      </footer>

    </div>
  );
};

export default App;
