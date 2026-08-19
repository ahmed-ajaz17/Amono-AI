import React, { useState } from 'react';
import { AlignmentMode, AlignmentResponse } from './types';
import { Compass, Sparkles, Send, ShieldCheck, Scale, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('compact');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleRunInference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/align', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    
      
        
          
            
          
          
            Amono AI
            Pluralistic Alignment Framework · Gemini 3.7 Flash
          
        
        
          
          Inference-Time Prompt Conditioning
        
      

      
        
          Socio-Ethical Dilemma Query
        
         setQuery(e.target.value)}
          placeholder="e.g., Should an individual prioritize familial care obligations over personal career relocation?"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500 min-h-[90px] mb-4"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setMode('compact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                mode === 'compact' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Compact (≤100w)
            </button>
            <button
              type="button"
              onClick={() => setMode('analytic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                mode === 'analytic' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Analytic (≤250w)
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            {loading ? <Cpu className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? 'Aligning...' : 'Evaluate Query'}</span>
          </button>
        </div>
      </form>

      {response && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <span className="font-mono text-xs text-blue-400">{response.metadataTag}</span>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
              <span>Words: <strong className="text-slate-200">{response.wordCount}</strong></span>
              <span>Latency: <strong className="text-slate-200">{response.latencyMs}ms</strong></span>
            </div>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed mb-6">{response.content}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            {['Indic / Dharmic', 'Collectivist', 'Indigenous', 'Western Liberal'].map((p, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5 text-blue-400 mb-1">
                  <Scale className="w-3.5 h-3.5" />
                  <span className="font-medium">{p}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Balanced Weight</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default App;
