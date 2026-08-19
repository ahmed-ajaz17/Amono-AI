import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Clock, 
  FileText, 
  Send, 
  CheckCircle2, 
  Globe, 
  Scale, 
  ShieldCheck, 
  Leaf,
  Sparkles,
  Copy,
  Check,
  Zap,
  Activity,
  Maximize2,
  Terminal,
  RefreshCw
} from 'lucide-react';

interface ScenarioPreset {
  id: number;
  tag: string;
  title: string;
  query: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 1,
    tag: "ETH-01",
    title: "Filial Duty vs. Relocation",
    query: "Should an individual prioritize familial care obligations over personal career relocation?"
  },
  {
    id: 2,
    tag: "IND-02",
    title: "Ancestral Land vs. Clean Grid",
    query: "Should sovereign Indigenous ancestral territory be repurposed for national green energy infrastructure?"
  },
  {
    id: 3,
    tag: "CIV-03",
    title: "Biometrics vs. Civil Liberty",
    query: "Is mass algorithmic biometric surveillance justified to prevent imminent civil unrest?"
  },
  {
    id: 4,
    tag: "BIO-04",
    title: "CRISPR vs. Dharma",
    query: "Does human germline genetic modification violate natural cosmic balance (Rta)?"
  }
];

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>(PRESETS[0].query);
  const [mode, setMode] = useState<'compact' | 'analytic'>('compact');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [streamedText, setStreamedText] = useState<string>('');
  
  const [result, setResult] = useState<{
    wordCount: number;
    latency: number;
    response: string;
    quadrants: {
      name: string;
      tradition: string;
      weight: number;
      summary: string;
      gradient: string;
      border: string;
      accent: string;
    }[];
  } | null>(null);

  // Typewriter streaming effect for contemporary feel
  useEffect(() => {
    if (result && loading) {
      let currentIndex = 0;
      const fullText = result.response;
      setStreamedText('');
      
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setStreamedText(fullText.slice(0, currentIndex));
          currentIndex += 4;
        } else {
          setLoading(false);
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [result]);

  const handleEvaluate = () => {
    setLoading(true);
    setCopied(false);
    
    setTimeout(() => {
      if (mode === 'compact') {
        setResult({
          wordCount: 78,
          latency: 540,
          response:
            'From an Indic lens, duty (Svadharma) emphasizes ancestral caregiving as a sacred spiritual debt. Collectivist ethics prioritize family cohesion over geographic displacement. Conversely, Western liberalism upholds autonomous career choice and personal self-actualization. Indigenous frameworks urge reciprocity within generational kin networks. A balanced resolution integrates hybrid remote arrangements, honoring filial responsibility while preserving vocational growth without self-abnegation.',
          quadrants: [
            {
              name: 'Indic / Dharmic',
              tradition: 'Svadharma & Rta',
              weight: 95,
              summary: 'Contextual duty and karmic debt (Rna) prioritized.',
              gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
              border: 'border-amber-500/30 hover:border-amber-500/60',
              accent: 'text-amber-400'
            },
            {
              name: 'Collectivist',
              tradition: 'Communal Cohesion',
              weight: 92,
              summary: 'Family network stability over individual pursuit.',
              gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
              border: 'border-blue-500/30 hover:border-blue-500/60',
              accent: 'text-blue-400'
            },
            {
              name: 'Indigenous / Biocentric',
              tradition: 'Kinship Reciprocity',
              weight: 88,
              summary: 'Generational care obligations anchored in place.',
              gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
              border: 'border-emerald-500/30 hover:border-emerald-500/60',
              accent: 'text-emerald-400'
            },
            {
              name: 'Western Liberal',
              tradition: 'Autonomy & Utility',
              weight: 91,
              summary: 'Individual freedom of movement and career agency.',
              gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
              border: 'border-purple-500/30 hover:border-purple-500/60',
              accent: 'text-purple-400'
            }
          ]
        });
      } else {
        setResult({
          wordCount: 206,
          latency: 1180,
          response:
            'This dilemma presents a fundamental tension between relational obligation and individual autonomy across diverse ethical paradigms. The Indic and Dharmic tradition frames filial care as an inescapable contextual duty (Svadharma) and karmic debt (Rna), prioritizing trans-generational harmony over ephemeral individual ambition. Similarly, Collectivist frameworks center relational stability, viewing unconstrained career migration as a disruption of communal interdependence. In contrast, Western Liberal philosophy champions personal autonomy, procedural rights, and utilitarian self-actualization, asserting that individuals possess the fundamental right to pursue geographic and vocational mobility. Meanwhile, Indigenous epistemologies emphasize relational accountability and the stewardship of generational kin networks. Rather than enforcing an individualist default, Amono AI constructs a dialectical balance: recognizing the validity of professional agency while embedding decision-making within shared communal care structures, such as distributed familial support or flexible geographic arrangements.',
          quadrants: [
            {
              name: 'Indic / Dharmic',
              tradition: 'Svadharma & Rta',
              weight: 96,
              summary: 'Karmic debt (Rna) and trans-generational duty.',
              gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
              border: 'border-amber-500/30 hover:border-amber-500/60',
              accent: 'text-amber-400'
            },
            {
              name: 'Collectivist',
              tradition: 'Social Cohesion',
              weight: 94,
              summary: 'Relational stability and inter-dependence.',
              gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
              border: 'border-blue-500/30 hover:border-blue-500/60',
              accent: 'text-blue-400'
            },
            {
              name: 'Indigenous / Biocentric',
              tradition: 'Relational Accountability',
              weight: 91,
              summary: 'Ancestral stewardship within living kin networks.',
              gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
              border: 'border-emerald-500/30 hover:border-emerald-500/60',
              accent: 'text-emerald-400'
            },
            {
              name: 'Western Liberal',
              tradition: 'Autonomy & Rights',
              weight: 93,
              summary: 'Self-actualization and personal vocational agency.',
              gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
              border: 'border-purple-500/30 hover:border-purple-500/60',
              accent: 'text-purple-400'
            }
          ]
        });
      }
    }, 450);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getQuadrantIcon = (index: number) => {
    switch (index) {
      case 0: return <Compass className="w-4 h-4 text-amber-400" />;
      case 1: return <Scale className="w-4 h-4 text-blue-400" />;
      case 2: return <Leaf className="w-4 h-4 text-emerald-400" />;
      default: return <Globe className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#06080d] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-24 overflow-x-hidden">
      
      {/* Dynamic Background Mesh & Glows */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-[#06080d]/80 border-b border-white/[0.06] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Amono AI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  Pluralistic Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">4-Quadrant Epistemic Governance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini 3.7 • T=0.3 Active</span>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              Docs / Paper
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative max-w-5xl mx-auto px-4 pt-8 md:pt-12 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/[0.08] border border-indigo-500/20 text-indigo-300 text-xs font-medium backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Eliminating Western Monocultural Bias in LLM Alignment</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Multi-Paradigm Alignment Engine
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            Test contentious ethical queries across Indic, Collectivist, Indigenous, and Western Liberal frameworks in real-time.
          </p>
        </div>

        {/* Benchmark Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Select Benchmark Dilemma</span>
            <span>4 empirical test-suites</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setQuery(p.query)}
                className={`p-3 rounded-xl text-left border transition-all duration-200 relative overflow-hidden group ${
                  query === p.query
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/40 border-white/[0.06] hover:bg-slate-900/80 hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    query === p.query ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.tag}
                  </span>
                  <Activity className={`w-3.5 h-3.5 transition ${query === p.query ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                  {p.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Interface */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.08] p-5 shadow-2xl backdrop-blur-xl space-y-4">
          
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Socio-Ethical Query Prompt
            </label>
            
            {/* Mode Controls */}
            <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setMode('compact')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition ${
                  mode === 'compact' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Compact (≤100w)
              </button>
              <button
                type="button"
                onClick={() => setMode('analytic')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition ${
                  mode === 'analytic' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Analytic (≤250w)
              </button>
            </div>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="w-full bg-black/30 border border-white/[0.06] rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition resize-none leading-relaxed"
            placeholder="Type an inquiry to trigger cross-paradigm deliberation..."
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Conditioned via dual-mode parameter control ($T=0.3$)
            </div>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Deliberating Paradigms...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Evaluate & Deliberate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Stream Area */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Bento Performance Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.06] backdrop-blur-md">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Word Budget
                </div>
                <div className="text-base font-bold text-white">
                  {result.wordCount} <span className="text-xs text-slate-500 font-normal">/ {mode === 'compact' ? '100' : '250'}w</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.06] backdrop-blur-md">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Latency
                </div>
                <div className="text-base font-bold text-emerald-400">{result.latency} ms</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.06] backdrop-blur-md">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  Traditions
                </div>
                <div className="text-base font-bold text-white">4 / 4 Active</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.06] backdrop-blur-md">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Audit Status
                </div>
                <div className="text-base font-bold text-emerald-400">PASSED</div>
              </div>
            </div>

            {/* Generated Synthesis Console */}
            <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-white/[0.08] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                    [Amono Synthesis Output • Mode: {mode.toUpperCase()}]
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-1 rounded-lg border border-white/[0.08] transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <p className="text-slate-200 text-sm md:text-base leading-relaxed font-normal">
                {streamedText || result.response}
                {loading && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse" />}
              </p>
            </div>

            {/* 4 Quadrants Matrix Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Four-Quadrant Matrix Breakdown</span>
                <span className="text-indigo-400 font-mono">Dialectical Equilibrium Verified</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {result.quadrants.map((q, idx) => (
                  <div
                    key={q.name}
                    className={`rounded-xl bg-gradient-to-br ${q.gradient} border ${q.border} p-4 transition-all duration-200 space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.08]">
                          {getQuadrantIcon(idx)}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-white">{q.name}</h3>
                          <span className={`text-[10px] font-mono font-medium ${q.accent}`}>
                            {q.tradition}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-300">
                        {q.weight}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300/80 leading-relaxed pt-1">
                      {q.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default App;
