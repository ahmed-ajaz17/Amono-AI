// Read Vite or process env key safely
const API_KEY = (
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.GEMINI_API_KEY ||
  ""
).trim();

const MODEL = "gemini-3.7-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic' = 'analytic') {
  if (!API_KEY) {
    throw new Error("Missing API Key. Ensure VITE_GEMINI_API_KEY is configured in Vercel settings.");
  }

  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';

  const prompt = `You are the Amono AI Epistemic Council Deliberation Engine.
Evaluate this user dilemma across 4 distinct philosophical traditions, followed by a dialectical synthesis:

Dilemma: "${query}"

Requirements:
1. INDIC: Grounded in Indic epistemology (Svadharma, Rna, Rta). (2-3 concise sentences)
2. COLLECTIVIST: Grounded in Collectivist & relational ethics, prioritizing social harmony. (2-3 concise sentences)
3. INDIGENOUS: Grounded in Indigenous epistemology and kinship reciprocity, prioritizing multi-generational stewardship. (2-3 concise sentences)
4. WESTERN: Grounded in Western liberalism, individual autonomy, and rights. (2-3 concise sentences)
5. SYNTHESIS: Dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}.

Return ONLY a raw JSON object with this exact structure:
{
  "indic": "stance text",
  "collectivist": "stance text",
  "indigenous": "stance text",
  "western": "stance text",
  "synthesis": "synthesis text"
}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || `API call failed with status ${res.status}`);
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleanJson = rawText.replace(/```json\n?|```/g, "").trim();
  const parsed = JSON.parse(cleanJson);

  // Return both object structure and agent array so whatever data shape your UI expects will work
  const agents = [
    {
      id: "indic",
      name: "Dharmic Sage",
      tradition: "Indic Epistemology",
      stance: parsed.indic || parsed.INDIC || "Evaluation complete."
    },
    {
      id: "collectivist",
      name: "Communal Guardian",
      tradition: "Collectivist Ethics",
      stance: parsed.collectivist || parsed.COLLECTIVIST || "Evaluation complete."
    },
    {
      id: "indigenous",
      name: "Biocentric Elder",
      tradition: "Indigenous Epistemology",
      stance: parsed.indigenous || parsed.INDIGENOUS || "Evaluation complete."
    },
    {
      id: "western",
      name: "Liberal Ethicist",
      tradition: "Western Liberalism",
      stance: parsed.western || parsed.WESTERN || "Evaluation complete."
    }
  ];

  const synthesis = parsed.synthesis || parsed.SYNTHESIS || "Consensus synthesis generated.";

  return {
    agents,
    synthesis,
    // Direct field fallbacks in case your UI accesses result.indic directly:
    indic: parsed.indic || parsed.INDIC || "",
    collectivist: parsed.collectivist || parsed.COLLECTIVIST || "",
    indigenous: parsed.indigenous || parsed.INDIGENOUS || "",
    western: parsed.western || parsed.WESTERN || ""
  };
}
