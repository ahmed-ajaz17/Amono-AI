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

const API_KEY = (
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.GEMINI_API_KEY ||
  ""
).trim();

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Verify your Vercel Environment Variables.");
  }

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

Return ONLY valid JSON matching this schema without markdown fences:
{
  "indic": "...",
  "collectivist": "...",
  "indigenous": "...",
  "western": "...",
  "synthesis": "..."
}`;

  // Using gemini-2.5-flash which has fresh free-tier request limits
  const MODEL = "gemini-2.5-flash";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

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
    throw new Error(data?.error?.message || `Google API HTTP ${response.status}`);
  }

  const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleanJson = rawJson.replace(/```json\n?|```/g, "").trim();
  const parsed = JSON.parse(cleanJson);

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
