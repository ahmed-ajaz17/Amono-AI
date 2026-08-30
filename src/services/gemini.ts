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

const MODEL = "gemini-3.6-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  if (!API_KEY) {
    throw new Error("Missing API Key. Please verify VITE_GEMINI_API_KEY in Vercel.");
  }

  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';

  const prompt = `You are the Amono AI Epistemic Council Deliberation Engine.
Analyze the following inquiry across 4 distinct philosophical traditions, then provide a dialectical equilibrium synthesis.

Inquiry: "${query}"

Traditions:
1. INDIC: Grounded in Indic epistemology (Svadharma, Rna, Rta).
2. COLLECTIVIST: Grounded in Collectivist & relational ethics, prioritizing social harmony.
3. INDIGENOUS: Grounded in Indigenous epistemology and kinship reciprocity.
4. WESTERN: Grounded in Western liberalism, individual rights, autonomy.
5. SYNTHESIS: Dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}.`;

  // Disable caching and force strict schema
  const response = await fetch(API_URL, {
    method: 'POST',
    cache: 'no-store', // PREVENTS REPEATING THE SAME ANSWER
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5, // Slightly higher to ensure varied responses
        responseMimeType: 'application/json',
        // THIS FORCES GEMINI TO USE EXACT KEYS
        responseSchema: {
          type: "object",
          properties: {
            indic: { type: "string" },
            collectivist: { type: "string" },
            indigenous: { type: "string" },
            western: { type: "string" },
            synthesis: { type: "string" }
          },
          required: ["indic", "collectivist", "indigenous", "western", "synthesis"]
        }
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API Error details:", data);
    throw new Error(data?.error?.message || `HTTP Error ${response.status}`);
  }

  // With strict schema, we don't need regex parsing, it's guaranteed valid JSON
  const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const parsed = JSON.parse(rawJson);
  
  // Log it to your console so you can verify it's working
  console.log("Gemini Output:", parsed);

  return {
    agents: [
      {
        id: "indic",
        name: "Dharmic Sage",
        tradition: "Indic Epistemology",
        stance: parsed.indic || "No Indic stance generated."
      },
      {
        id: "collectivist",
        name: "Communal Guardian",
        tradition: "Collectivist Ethics",
        stance: parsed.collectivist || "No Collectivist stance generated."
      },
      {
        id: "indigenous",
        name: "Biocentric Elder",
        tradition: "Indigenous Epistemology",
        stance: parsed.indigenous || "No Indigenous stance generated."
      },
      {
        id: "western",
        name: "Liberal Ethicist",
        tradition: "Western Liberalism",
        stance: parsed.western || "No Western stance generated."
      }
    ],
    synthesis: parsed.synthesis || "No synthesis generated."
  };
}
