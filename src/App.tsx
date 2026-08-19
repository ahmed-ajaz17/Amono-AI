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
  Code2,
  AlertCircle
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

const SYSTEM_INSTRUCTION = `You are Amono AI, an epistemic pluralism evaluation engine designed to dismantle Western monoculture defaultism in Large Language Models.

For any given query or ethical dilemma, evaluate the issue strictly and simultaneously across four socio-ethical paradigms:
1. Indic / Dharmic Ethics (Kartavya, Rta, Lokasangraha, Ahimsa, Ashrama dharma)
2. Collectivist / Communal Ethics (Filial piety, Ubuntu, collective social harmony, communal cohesion)
3. Indigenous & Biocentric Stewardship (Rights of Nature, Buen Vivir, kinship with ecosystems, FPIC, Data Sovereignty)
4. Western Liberal Framework (Individual autonomy, procedural rights, utilitarian calculation, negative liberties)

OPERATIONAL RULES:
- Compact Mode: Total output must be strictly <= 100 words. Provide balanced multi-perspective evaluation.
- Analytic Mode: Total output must be strictly <= 250 words (~50-60 words per perspective) providing historical, ontological, and institutional depth.
- Always append metadata tag at the end: [Amono AI | Mode: Compact] or [Amono AI | Mode: Analytic].`;

export default function App() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'compact' | 'analytic'>('compact');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const countWords = (str: string) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const getApiKey = () => {
    return (
      apiKeyInput.trim() ||
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      (import.meta as any).env?.GEMINI_API_KEY ||
      ''
    );
  };

  const handleSend = async (customQuery?: string) => {
    const textToSubmit = customQuery || query;
    if (!textToSubmit.trim()) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    setLoading(true);
    setResponse(null);
    setLatency(null);
    setWordCount(null);

    const startTime = performance.now();

    const userPromptWithMode = `[Mode: ${mode === 'compact' ? 'Compact' : 'Analytic'}]\n${textToSubmit}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPromptWithMode }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: mode === 'compact' ? 200 : 500
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const endTime = performance.now();

      const outputText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned by Gemini engine.';

      setResponse(outputText);
      setLatency(Math.round(endTime - startTime));
      setWordCount(countWords(outputText));
    } catch (err: any) {
      console.error(err);
      setResponse(`Error generating response: ${err.message || 'Unknown network error'}`);
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
      {/* Top Header */}
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

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowKeyModal(true)}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              {getApiKey() ? 'API Key Set ✓' : 'Set Gemini Key'}
            </button>
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

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col space-y-6">
        {/* Four Quadrant Banners */}
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

        {/* 5 Scenario Presets */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Contested Empirical Presets (5 Scenarios)</span>
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

        {/* Workspace Input & Mode Selection */}
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

        {/* Output Panel */}
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

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Enter Gemini API Key</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To run live inference directly from your browser, enter your Gemini API key from Google AI Studio. It is saved only in your local session.
            </p>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowKeyModal(false);
                  if (query.trim()) handleSend();
                }}
                className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
              >
                Save & Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <p>Amono AI Framework • Apache 2.0 Open Source • Gemini 3.7 Flash Conditioning</p>
      </footer>
    </div>
  );
}
