import React, { useState } from 'react';
import { 
  Compass, 
  Send, 
  Sparkles, 
  Layers, 
  Zap, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  Globe2, 
  TreePine, 
  ScrollText, 
  ExternalLink,
  Code2
} from 'lucide-react';

interface Preset {
  id: string;
  label: string;
  query: string;
}

const PRESETS: Preset[] = [
  {
    id: 'filial-duty',
    label: 'Filial Duty vs. Relocation',
    query: 'Should an individual prioritize familial care obligations over personal career relocation?'
  },
  {
    id: 'indigenous-land',
    label: 'Indigenous Land vs. Green Grid',
    query: 'How should indigenous ancestral land rights be weighed against public infrastructure development?'
  },
  {
    id: 'biometric-surveillance',
    label: 'Biometric Surveillance vs. Safety',
    query: 'Is individual digital privacy absolute, or should state surveillance be permitted for public safety?'
  },
  {
    id: 'crispr-dharma',
    label: 'CRISPR vs. Cosmic Dharma',
    query: 'Should human germline genetic modification be permitted for hereditary disease eradication and biological enhancement?'
  },
  {
    id: 'ai-artisanship',
    label: 'AI Automation vs. Traditional Craft',
    query: 'How should the automation of indigenous artisanal craft patterns by generative AI models be governed?'
  }
];

export default function App() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'compact' | 'analytic'>('compact');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);

  const countWords = (str: string) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleSend = async (customQuery?: string) => {
    const textToSubmit = customQuery || query;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setResponse(null);
    setLatency(null);
    setWordCount(null);

    const startTime = performance.now();

    try {
      // Primary attempt to /api/chat, fallback to /api/evaluate
      let res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSubmit,
          prompt: textToSubmit,
          mode: mode
        })
      });

      if (res.status === 404) {
        res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textToSubmit,
            mode: mode
          })
        });
      }

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const endTime = performance.now();

      const outputText = data.response || data.text || data.reply || data.result || 'No output returned.';
      setResponse(outputText);
      setLatency(Math.round(endTime - startTime));
      setWordCount(countWords(outputText));
    } catch (err: any) {
      console.error(err);
      setResponse(`Error connecting to inference backend: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (preset: Preset) => {
    setQuery(preset.query);
    handleSend(preset.query);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600/20 border border-indigo-500/40 p-2 rounded-xl text-indigo-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-100 bg-clip-text text-transparent">
                Amono AI
              </h1>
              <p className="text-xs text-slate-400">Epistemic Pluralism Chamber</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/ahmed-ajaz17/amono-ai" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
            </a>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col space-y-6">
        {/* Quad Banners */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl flex items-center space-x-3">
            <ScrollText className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-amber-200">Indic / Dharmic</div>
              <div className="text-[10px] text-amber-400/80">Kartavya & Rta Balance</div>
            </div>
          </div>

          <div className="p-3 bg-rose-950/20 border border-rose-800/30 rounded-xl flex items-center space-x-3">
            <Globe2 className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-rose-200">Collectivist</div>
              <div className="text-[10px] text-rose-400/80">Communal Interdependence</div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl flex items-center space-x-3">
            <TreePine className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-emerald-200">Indigenous</div>
              <div className="text-[10px] text-emerald-400/80">Biocentric Custodianship</div>
            </div>
          </div>

          <div className="p-3 bg-sky-950/20 border border-sky-800/30 rounded-xl flex items-center space-x-3">
            <Scale className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-sky-200">Western Liberal</div>
              <div className="text-[10px] text-sky-400/80">Autonomy & Rights</div>
            </div>
          </div>
        </section>

        {/* Presets */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Contested Empirical Presets</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className="text-xs bg-slate-900/90 hover:bg-indigo-950/70 border border-slate-800 hover:border-indigo-600/50 text-slate-300 hover:text-indigo-200 px-3 py-1.5 rounded-lg transition text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        {/* Mode Selector and Prompt Box */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Operating Mode
              </span>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setMode('compact')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                  mode === 'compact'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Compact (≤ 100w)</span>
              </button>
              <button
                onClick={() => setMode('analytic')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                  mode === 'analytic'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Analytic (≤ 250w)</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pose an ethical dilemma or socio-technical policy dispute..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className="absolute right-3 bottom-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition shadow"
            >
              {loading ? (
                <span>Evaluating...</span>
              ) : (
                <>
                  <span>Synthesize</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Output View */}
        {response && (
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">
                  Four-Quadrant Pluralistic Deliberation
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                {wordCount !== null && (
                  <span className={`px-2.5 py-0.5 rounded-full font-mono border ${
                    (mode === 'compact' && wordCount <= 100) || (mode === 'analytic' && wordCount <= 250)
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                      : 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                  }`}>
                    {wordCount} words ({mode === 'compact' ? 'Limit: 100' : 'Limit: 250'})
                  </span>
                )}
                {latency !== null && (
                  <span className="px-2.5 py-0.5 rounded-full font-mono bg-slate-950 text-slate-400 border border-slate-800">
                    {latency} ms
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <p>Amono AI Framework • Apache 2.0 Open Source • Gemini 3.7 Flash Conditioning</p>
      </footer>
    </div>
  );
}
