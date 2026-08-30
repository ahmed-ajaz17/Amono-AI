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

const RAW_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
const API_KEY = RAW_KEY.trim();

async function callGemini(model: string, query: string, mode: 'compact' | 'analytic') {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';

  const prompt = `You are the Amono AI Epistemic Council Deliberation Engine.
Analyze the following inquiry across 4 distinct philosophical traditions, then provide a dialectical equilibrium synthesis.

Inquiry: "${query}"

Traditions:
1. INDIC: Grounded in Indic epistemology (Svadharma, Rna, Rta). (2-3 sentences)
2. COLLECTIVIST: Grounded in Collectivist & relational ethics, prioritizing social harmony. (2-3 sentences)
3. INDIGENOUS: Grounded in Indigenous epistemology and kinship reciprocity. (2-3 sentences)
4. WESTERN: Grounded in Western liberalism, individual rights, autonomy. (2-3 sentences)
5. SYNTHESIS: Dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}.

Return ONLY valid JSON in this exact structure without markdown fences:
{
  "indic": "...",
  "collectivist": "...",
  "indigenous": "...",
  "western": "...",
  "synthesis": "..."
}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.error?.message || `HTTP ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }

  const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleanJson = rawJson.replace(/```json\n?|```/g, "").trim();
  return JSON.parse(cleanJson);
}

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  if (!API_KEY) {
    throw new Error("Missing API Key. Please verify VITE_GEMINI_API_KEY in Vercel.");
  }

  let parsed: any;

  try {
    parsed = await callGemini('gemini-3.7-flash', query, mode);
  } catch (err: any) {
    console.warn("Falling back to gemini-2.5-flash due to rate limit/error:", err);
    parsed = await callGemini('gemini-2.5-flash', query, mode);
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
