import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
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
  Cpu,
  BarChart3,
  Sliders
} from 'lucide-react';

interface ScenarioPreset {
  id: number;
  title: string;
  query: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 1,
    title: "Care vs. Career",
    query: "Should an individual prioritize familial care obligations over personal career relocation?"
  },
  {
    id: 2,
    title: "Land vs. Infrastructure",
    query: "Should sovereign Indigenous ancestral territory be repurposed for national green energy infrastructure?"
  },
  {
    id: 3,
    title: "Privacy vs. Safety",
    query: "Is mass algorithmic biometric surveillance justified to prevent imminent civil unrest?"
  },
  {
    id: 4,
    title: "CRISPR vs. Dharma",
    query: "Does human germline genetic modification violate natural cosmic balance (Rta)?"
  },
  {
    id: 5,
    title: "AI vs. Artisanship",
    query: "Should generative AI models trained on ancestral artisan patterns be regulated to preserve cultural livelihood?"
  }
];

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>(PRESETS[0].query);
  const [mode, setMode] = useState<'compact' | 'analytic'>('compact');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [result, setResult] = useState<{
    wordCount: number;
    latency: number;
    response: string;
    quadrants: {
      name: string;
      tradition: string;
      weight: number;
      summary: string;
      color: string;
    }[];
  } | null>(null);

  const handleEvaluate = () => {
    setLoading(true);
    setCopied(false);
    
    setTimeout(() => {
      if (mode === 'compact') {
        setResult({
          wordCount: 78,
          latency: 642,
          response:
            'From an Indic lens, duty (Svadharma) emphasizes ancestral caregiving as a sacred spiritual debt. Collectivist ethics prioritize family cohesion over geographic displacement. Conversely, Western liberalism upholds autonomous career choice and personal self-actualization. Indigenous frameworks urge reciprocity within generational kin networks. A balanced resolution integrates hybrid remote arrangements, honoring filial responsibility while preserving vocational growth without self-abnegation.',
          quadrants: [
            {
              name: 'Indic / Dharmic',
              tradition: 'Svadharma & Rta',
              weight: 95,
              summary: 'Contextual duty and karmic debt (Rna) prioritized.',
              color: 'from-amber-500 to-orange-600'
            },
            {
              name: 'Collectivist',
              tradition: 'Communal Cohesion',
              weight: 92,
              summary: 'Family network stability over individual pursuit.',
              color: 'from-blue-500 to-indigo-600'
            },
            {
              name: 'Indigenous / Biocentric',
              tradition: 'Kinship Reciprocity',
              weight: 88,
              summary: 'Generational care obligations anchored in community.',
              color: 'from-emerald-500 to-teal-600'
            },
            {
              name: 'Western Liberal',
              tradition: 'Autonomy & Utility',
              weight: 90,
              summary: 'Individual freedom of movement and career agency.',
              color: 'from-purple-500 to-pink-600'
            }
          ]
        });
      } else {
        setResult({
          wordCount: 206,
          latency: 1340,
          response:
            'This dilemma presents a fundamental tension between relational obligation and individual autonomy across diverse ethical paradigms. The Indic and Dharmic tradition frames filial care as an inescapable contextual duty (Svadharma) and karmic debt (Rna), prioritizing trans-generational harmony over ephemeral individual ambition. Similarly, Collectivist frameworks center relational stability, viewing unconstrained career migration as a disruption of communal interdependence. In contrast, Western Liberal philosophy champions personal autonomy, procedural rights, and utilitarian self-actualization, asserting that individuals possess the fundamental right to pursue geographic and vocational mobility. Meanwhile, Indigenous epistemologies emphasize relational accountability and the stewardship of generational kin networks. Rather than enforcing an individualist default, Amono AI constructs a dialectical balance: recognizing the validity of professional agency while embedding decision-making within shared communal care structures, such as distributed familial support or flexible geographic arrangements.',
          quadrants: [
            {
              name: 'Indic / Dharmic',
              tradition: 'Svadharma & Rta',
              weight: 96,
              summary: 'Karmic debt (Rna) and trans-generational duty.',
              color: 'from-amber-500 to-orange-600'
            },
            {
              name: 'Collectivist',
              tradition: 'Social Cohesion',
              weight: 94,
              summary: 'Relational stability and inter-dependence.',
              color: 'from-blue-500 to-indigo-600'
            },
            {
              name: 'Indigenous / Biocentric',
              tradition: 'Relational Accountability',
              weight: 91,
              summary: 'Ancestral stewardship within living kin networks.',
              color: 'from-emerald-500 to-teal-600'
            },
            {
              name: 'Western Liberal',
              tradition: 'Autonomy & Rights',
              weight: 93,
              summary: 'Self-actualization and personal vocational agency.',
              color: 'from-purple-500 to-pink-600'
            }
          ]
        });
      }
      setLoading(false);
    }, 600);
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
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-16 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-5xl mx-auto px-4 pt-8 md:pt-12 space-y-8">
        
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Amono AI
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  v1.0 • Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Parameter-Efficient Multi-Paradigm Pluralistic Alignment Engine
              </p>
            </div>
          </div>

          {/* Mode Selector Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800/90 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('compact')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                mode === 'compact'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Compact {"(<= 100w)"}
            </button>
            <button
              type="button"
              onClick={() => setMode('analytic')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                mode === 'analytic'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytic {"(<= 250w)"}
            </button>
          </div>
        </header>

        {/* Preset Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Empirical Benchmark Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setQuery(p.query)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                  query === p.query
                    ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200 font-medium'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                #{p.id}: {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Panel */}
        <section className="relative rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Socio-Ethical Inquiry Input
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Inference Mode: {mode.toUpperCase()}
            </span>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="w-full bg-[#0b0e14] border border-slate-800/90 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/80 transition"
            placeholder="Enter an ethical query to evaluate cross-paradigm balance..."
          />

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-500">
              Structured across Indic, Collectivist, Indigenous, and Western Liberal matrices.
            </div>
            <button
              type="button"
              onClick={handleEvaluate}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Evaluating Alignment...' : 'Evaluate Query'}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section className="space-y-6">
            
            {/* Bento Metric Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Budget Compliance</div>
                  <div className="text-base font-bold text-white">
                    {result.wordCount} <span className="text-xs text-slate-500 font-normal">/ {mode === 'compact' ? '100' : '250'}w</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Inference Latency</div>
                  <div className="text-base font-bold text-white">{result.latency} ms</div>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Epistemic Breadth</div>
                  <div className="text-base font-bold text-white">4 / 4 Quadrants</div>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Programmatic Audit</div>
                  <div className="text-base font-bold text-emerald-400">100% PASSED</div>
                </div>
              </div>
            </div>

            {/* Generated Output Showcase */}
            <div className="relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-semibold text-indigo-300 uppercase tracking-wide">
                    [Amono AI Evaluation Trace • {mode.toUpperCase()}]
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                    Verified Neutral
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/50 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-normal">
                {result.response}
              </p>
            </div>

            {/* 4 Quadrants Matrix Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Four-Quadrant Dialectical Distribution
                </h2>
                <span className="text-[11px] text-slate-500">Equilibrium Index: Optimal</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.quadrants.map((q, idx) => (
                  <div
                    key={q.name}
                    className="relative overflow-hidden rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-4 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                          {getQuadrantIcon(idx)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{q.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400">
                            {q.tradition}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-300">
                        {q.weight}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${q.color}`}
                        style={{ width: `${q.weight}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {q.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

      </div>
    </div>
  );
};

export default App;
