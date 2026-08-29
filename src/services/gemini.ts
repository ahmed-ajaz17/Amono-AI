const RAW_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
const API_KEY = RAW_KEY.trim();

const MODEL = "gemini-3.7-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

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

// Client-side cache to save quota on duplicate prompts
const queryCache = new Map<string, CouncilResult>();

// Delay helper for rate-limit retries
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 2000): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (response.status === 429 && retries > 0) {
      console.warn(`[Gemini 3.7] Quota limit encountered. Retrying in ${delay}ms...`);
      await wait(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    return response;
  } catch (err) {
    if (retries > 0) {
      await wait(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  const cacheKey = `${query.trim().toLowerCase()}_${mode}`;
  
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey)!;
  }

  if (!API_KEY) {
    throw new Error("Missing API key. Ensure VITE_GEMINI_API_KEY is configured in Vercel.");
  }

  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';

  const unifiedPrompt = `You are the Amono AI Epistemic Deliberation Engine. Evaluate the inquiry across 4 traditions and generate a dialectical equilibrium synthesis.

Inquiry: "${query}"

Traditions:
1. INDIC: Grounded in Indic epistemology (Svadharma, Rna, Rta). 2-3 concise sentences.
2. COLLECTIVIST: Grounded in Collectivist & relational ethics, prioritizing social cohesion. 2-3 concise sentences.
3. INDIGENOUS: Grounded in Indigenous epistemology and kinship reciprocity, prioritizing generational stewardship. 2-3 concise sentences.
4. WESTERN: Grounded in Western liberalism, individual rights, autonomy, and self-determination. 2-3 concise sentences.
5. SYNTHESIS: Dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}. Do not enforce Western monoculture defaultism.

Return ONLY a JSON object matching this schema without markdown code fences:
{
  "indic": "Indic perspective string",
  "collectivist": "Collectivist perspective string",
  "indigenous": "Indigenous perspective string",
  "western": "Western perspective string",
  "synthesis": "Dialectical consensus string"
}`;

  const response = await fetchWithRetry(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: unifiedPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}`;
    console.error("Gemini 3.7 Error:", data);
    throw new Error(errorMsg);
  }

  const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJson) {
    throw new Error("Empty response received from Gemini 3.7.");
  }

  const parsed = JSON.parse(rawJson);

  const result: CouncilResult = {
    agents: [
      {
        id: "indic",
        name: "Dharmic Sage",
        tradition: "Indic Epistemology",
        stance: parsed.indic || "Stance deliberation unavailable."
      },
      {
        id: "collectivist",
        name: "Communal Guardian",
        tradition: "Collectivist Ethics",
        stance: parsed.collectivist || "Stance deliberation unavailable."
      },
      {
        id: "indigenous",
        name: "Biocentric Elder",
        tradition: "Indigenous Epistemology",
        stance: parsed.indigenous || "Stance deliberation unavailable."
      },
      {
        id: "western",
        name: "Liberal Ethicist",
        tradition: "Western Liberalism",
        stance: parsed.western || "Stance deliberation unavailable."
      }
    ],
    synthesis: parsed.synthesis || "Synthesis completed."
  };

  // Store in cache
  queryCache.set(cacheKey, result);

  return result;
}
