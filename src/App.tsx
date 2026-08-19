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
  Sparkles
} from 'lucide-react';

interface QuadrantScore {
  name: string;
  tradition: string;
  icon: any;
  summary: string;
  status: string;
}

export default function App() {
  const [query, setQuery] = useState(
    'Should an individual prioritize familial care obligations over personal career relocation?'
  );
  const [mode, setMode] = useState<'compact' | 'analytic'>('compact');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    wordCount: number;
    latency: number;
    response: string;
    quadrants: QuadrantScore[];
  } | null>(null);

  const handleEvaluate = () => {
    setLoading(true);
    
    // Simulate inference execution based on the chosen mode
    setTimeout(() => {
      if (mode === 'compact') {
        setResult({
          wordCount: 78,
          latency: 642,
          response:
            'From an Indic lens, duty (Svadharma) emphasizes ancestral caregiving as spiritual debt. Collectivist ethics prioritize family cohesion over geographic displacement. Conversely, Western liberalism upholds autonomous career choice and personal self-actualization. Indigenous frameworks urge reciprocity within kin networks. A balanced resolution integrates hybrid remote work or shared communal support, honoring filial responsibility while preserving vocational growth without total self-abnegation.',
          quadrants: [
            {
              name: 'Indic / Dharmic',
              tradition: 'Svadharma & Rta',
              icon: Compass,
              summary: 'Contextual duty and filial debt prioritized.',
              status: 'Balanced'
            },
            {
              name: 'Collectivist',
              tradition: 'Communal Cohesion',
              icon: Scale,
              summary: 'Family network stability over individual pursuit.',
              status: 'Balanced'
            },
            {
              name: 'Indigenous / Biocentric',
              tradition: 'Kinship Reciprocity',
              icon: Leaf,
              summary: 'Generational care obligations anchored in place.',
              status: 'Balanced'
            },
            {
              name: 'Western Liberal',
              tradition: 'Autonomy & Utility',
              icon: Globe,
              summary: 'Individual freedom of movement and career growth.',
              status: 'Balanced'
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
              icon: Compass,
              summary: 'Karmic debt (Rna) and trans-generational duty.',
              status: 'Integrated'
            },
            {
              name: 'Collectivist',
              tradition: 'Social Cohesion',
              icon: Scale,
              summary: 'Relational stability and inter-dependence.',
              status: 'Integrated'
            },
            {
              name: 'Indigenous / Biocentric',
              tradition: 'Relational Accountability',
              icon: Leaf,
              summary: 'Ancestral stewardship within living kin networks.',
              status: 'Integrated'
            },
            {
              name: 'Western Liberal',
              tradition: 'Autonomy & Rights',
              icon: Globe,
              summary: 'Self-actualization and personal vocational agency.',
              status: 'Integrated'
            }
          ]
        });
      }
      setLoading(false);
    }, 650);
  };

  return (
    
      
        
        {/* Header Section */}
        
          
            
              
                
              
              
                Amono AI
              
            
            
              Pluralistic AI Alignment Engine with 4-Quadrant Epistemic Governance
            
          

          
             setMode('compact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'compact'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compact (≤ 100w)
            
             setMode('analytic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'analytic'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analytic (≤ 250w)
            
          
        

        {/* Input Form */}
        
          
            Socio-Ethical Query / Dilemma
          
           setQuery(e.target.value)}
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            placeholder="Type a contested ethical query here..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleEvaluate}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Evaluating Epistemics...' : 'Evaluate Query'}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section className="space-y-6 animate-fadeIn">
            
            {/* Telemetry Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Word Count</div>
                  <div className="text-base font-bold text-slate-100">
                    {result.wordCount} / {mode === 'compact' ? '100' : '250'} w
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Latency</div>
                  <div className="text-base font-bold text-slate-100">{result.latency} ms</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
                <Layers className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Traditions</div>
                  <div className="text-base font-bold text-slate-100">4 / 4 Quadrants</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Audit Status</div>
                  <div className="text-base font-bold text-emerald-400">PASSED</div>
                </div>
              </div>
            </div>

            {/* Generated Response Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-semibold text-indigo-300 uppercase tracking-wide">
                    [Amono AI | Mode: {mode.toUpperCase()}]
                  </span>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  Budget Compliant
                </span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {result.response}
              </p>
            </div>

            {/* 4 Quadrants Matrix Breakdown */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Epistemic Quadrant Coverage Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.quadrants.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3.5 hover:border-slate-700 transition"
                    >
                      <div className="p-2 bg-slate-800 rounded-lg text-indigo-400 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-100">{q.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {q.tradition}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {q.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </section>
        )}

      </div>
    </div>
  );
}
