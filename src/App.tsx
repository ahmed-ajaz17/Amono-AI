import React, { useState } from 'react';
import { runAmonoCouncil, CouncilResult } from './services/gemini';

export default function App() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'compact' | 'analytic'>('analytic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CouncilResult | null>(null);

  const presets = [
    {
      label: "Autonomous Vehicles",
      text: "Should an autonomous vehicle prioritize passenger safety or pedestrian casualties in unavoidable crash scenarios?"
    },
    {
      label: "Genetic Engineering",
      text: "Is CRISPR gene editing on human embryos ethically justifiable to eliminate hereditary diseases?"
    },
    {
      label: "Sacred Land vs Clean Energy",
      text: "Should renewable clean energy projects be built on indigenous lands held sacred by local communities?"
    }
  ];

  const handleConvene = async (customQuery?: string) => {
    const promptToRun = customQuery || query;
    if (!promptToRun.trim()) {
      alert("Please enter a question or dilemma first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await runAmonoCouncil(promptToRun, mode);
      setResult(data);
    } catch (err: any) {
      console.error("Deliberation Error:", err);
      setError(err?.message || "Failed to convene council. Check API Key or Network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1f2937' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p align="center" style={{ margin: '0 0 16px 0' }}>
          <img src="./logo.svg" alt="Amono AI Logo" width="160" />
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0', letterSpacing: '-0.5px' }}>
          Amono AI Council
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
          Pluralistic Epistemic Alignment & Deliberation Engine
        </p>
      </div>

      {/* Preset Chips */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '8px' }}>
          Example Presets (or type your own below):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(p.text);
                handleConvene(p.text);
              }}
              style={{
                fontSize: '13px',
                padding: '6px 12px',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Chamber */}
      <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
        <textarea
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type any moral, philosophical, or governance dilemma here..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px',
            fontSize: '15px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#6b7280' }}>Synthesis Length:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'compact' | 'analytic')}
              style={{ padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="compact">Compact (&lt; 100 words)</option>
              <option value="analytic">Analytic (&lt; 250 words)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleConvene()}
            disabled={loading}
            style={{
              padding: '10px 24px',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: loading ? '#9ca3af' : '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Deliberating Council...' : 'Convene Amono Council'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Deliberation Results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Synthesized Consensus */}
          <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#166534' }}>
              Synthesized Consensus (Dialectical Equilibrium)
            </h2>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.65', color: '#14532d' }}>
              {result.synthesis}
            </p>
          </div>

          {/* Individual Agent Positions */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>
              Individual Epistemic Traditions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
              {result.agents.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    padding: '16px',
                    background: '#fafafa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                      {agent.name}
                    </h3>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '10px' }}>
                      {agent.tradition}
                    </span>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.55', color: '#374151' }}>
                      {agent.stance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
