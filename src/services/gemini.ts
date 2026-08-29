// src/services/gemini.ts

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

// Primary model is 3.7; fallback is 3.6
export const PRIMARY_MODEL = "gemini-3.7-flash";
export const FALLBACK_MODEL = "gemini-3.6-flash";

const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || PRIMARY_MODEL;

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

const SYSTEM_INSTRUCTIONS = {
  indic: "You are the Dharmic Sage grounded in Indic epistemology (Svadharma, Rna, Rta). Provide a concise stance (2-3 sentences) on the given dilemma.",
  collectivist: "You are the Communal Guardian grounded in Collectivist and relational ethics. Provide a concise stance (2-3 sentences) prioritizing social cohesion and familial interdependence.",
  indigenous: "You are the Biocentric Elder grounded in Indigenous epistemology and kinship reciprocity. Provide a concise stance (2-3 sentences) emphasizing place-based generational stewardship.",
  western: "You are the Liberal Ethicist grounded in Western liberalism, individual rights, and autonomy. Provide a concise stance (2-3 sentences) prioritizing personal self-determination."
};

// Helper to execute generation with automatic 3.7 -> 3.6 fallback
async function generateWithFallback(prompt: string, temp: number = 0.3): Promise<string> {
  const models = [DEFAULT_MODEL, FALLBACK_MODEL];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: temp }
        })
      });

      const data = await response.json();
      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
      console.warn(`[${model}] request failed, attempting fallback...`, data);
    } catch (err) {
      console.warn(`[${model}] network error, attempting fallback...`, err);
    }
  }

  throw new Error("Deliberation failed across both Gemini 3.7 and 3.6 endpoints.");
}

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';

  if (!API_KEY) {
    throw new Error("Gemini API key is missing. Set VITE_GEMINI_API_KEY in environment variables.");
  }

  // 1. Deliberate 4 agent stances concurrently (T=0.3)
  const agentKeys = Object.keys(SYSTEM_INSTRUCTIONS) as (keyof typeof SYSTEM_INSTRUCTIONS)[];
  
  const agentPromises = agentKeys.map(async (key) => {
    try {
      const prompt = `${SYSTEM_INSTRUCTIONS[key]}\n\nDilemma: "${query}"`;
      const stance = await generateWithFallback(prompt, 0.3);
      return { id: key, stance };
    } catch {
      return { id: key, stance: "Perspective temporarily unavailable." };
    }
  });

  const agentOutputs = await Promise.all(agentPromises);

  // 2. Synthesize dialectical equilibrium across both paradigms (T=0.3)
  const agentContext = agentOutputs.map(a => `${a.id.toUpperCase()}: ${a.stance}`).join('\n\n');
  
  const synthesisPrompt = `You are the Amono AI Synthesis Engine. Your goal is Pluralistic Alignment across epistemic traditions.
Analyze the following perspectives on the inquiry: "${query}"

${agentContext}

Provide a dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}. Do not enforce Western monoculture defaultism.`;

  try {
    const synthesisText = await generateWithFallback(synthesisPrompt, 0.3);
    return {
      agents: mapAgents(agentOutputs),
      synthesis: synthesisText
    };
  } catch (err) {
    return {
      agents: mapAgents(agentOutputs),
      synthesis: "Unable to generate consensus across epistemic streams."
    };
  }
}

function mapAgents(agentOutputs: { id: string; stance: string }[]): AgentResponse[] {
  return agentOutputs.map(a => ({
    id: a.id,
    name: a.id === 'indic' ? 'Dharmic Sage' : a.id === 'collectivist' ? 'Communal Guardian' : a.id === 'indigenous' ? 'Biocentric Elder' : 'Liberal Ethicist',
    tradition: a.id === 'indic' ? 'Indic Epistemology' : a.id === 'collectivist' ? 'Collectivist Ethics' : a.id === 'indigenous' ? 'Indigenous Epistemology' : 'Western Liberalism',
    stance: a.stance
  }));
}
