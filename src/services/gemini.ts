export interface AgentResponse {
  id: string;
  name: string;
  tradition: string;
  stance: string;
}

export interface CouncilResult {
  agents: AgentResponse[];
  synthesis: string;
}

const RAW_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY)) ||
  "";
const API_KEY = RAW_KEY.trim();

// Priority cascade: tries fast high-quota models first, falling back sequentially
const MODELS_TO_TRY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-3.7-flash'
];

async function callSingleModel(modelName: string, query: string, mode: 'compact' | 'analytic') {
  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

  const prompt = `You are the Amono AI Epistemic Council Deliberation Engine.
Analyze the following inquiry across 4 distinct philosophical traditions, then provide a dialectical equilibrium synthesis.

Inquiry: "${query}"

Traditions:
1. INDIC: Grounded in Indic epistemology (Svadharma, Rna, Rta). (2-3 sentences)
2. COLLECTIVIST: Grounded in Collectivist & relational ethics, prioritizing social harmony. (2-3 sentences)
3. INDIGENOUS: Grounded in Indigenous epistemology and kinship reciprocity. (2-3 sentences)
4. WESTERN: Grounded in Western liberalism, individual rights, autonomy. (2-3 sentences)
5. SYNTHESIS: Dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}.

Return ONLY valid JSON matching this schema:
{
  "indic": "stance text",
  "collectivist": "stance text",
  "indigenous": "stance text",
  "western": "stance text",
  "synthesis": "synthesis text"
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}`;
    const err = new Error(errorMsg);
    (err as any).status = response.status;
    throw err;
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
  // Safe JSON extraction using regex
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from engine.");
  }

  return JSON.parse(jsonMatch[0]);
}

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  if (!API_KEY) {
    throw new Error("Missing API Key. Please verify VITE_GEMINI_API_KEY in Vercel.");
  }

  let parsed: any = null;
  let lastError: any = null;

  for (const model of MODELS_TO_TRY) {
    try {
      parsed = await callSingleModel(model, query, mode);
      if (parsed) break; // Success
    } catch (err: any) {
      console.warn(`Model ${model} failed (${err?.message || err}). Trying next in cascade...`);
      lastError = err;
    }
  }

  if (!parsed) {
    throw new Error(lastError?.message || "All epistemic models in the cascade failed.");
  }

  return {
    agents: [
      {
        id: "indic",
        name: "Dharmic Sage",
        tradition: "Indic Epistemology",
        stance: parsed.indic || parsed.INDIC || "Stance evaluated."
      },
      {
        id: "collectivist",
        name: "Communal Guardian",
        tradition: "Collectivist Ethics",
        stance: parsed.collectivist || parsed.COLLECTIVIST || "Stance evaluated."
      },
      {
        id: "indigenous",
        name: "Biocentric Elder",
        tradition: "Indigenous Epistemology",
        stance: parsed.indigenous || parsed.INDIGENOUS || "Stance evaluated."
      },
      {
        id: "western",
        name: "Liberal Ethicist",
        tradition: "Western Liberalism",
        stance: parsed.western || parsed.WESTERN || "Stance evaluated."
      }
    ],
    synthesis: parsed.synthesis || parsed.SYNTHESIS || "Dialectical consensus synthesized."
  };
}
