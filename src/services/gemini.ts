// src/services/gemini.ts

const RAW_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
const API_KEY = RAW_KEY.trim(); // Cleans any hidden copy-paste whitespace

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

const SYSTEM_INSTRUCTIONS = {
  indic: "You are the Dharmic Sage grounded in Indic epistemology (Svadharma, Rna, Rta). Provide a concise stance (2-3 sentences) on the given dilemma.",
  collectivist: "You are the Communal Guardian grounded in Collectivist and relational ethics. Provide a concise stance (2-3 sentences) prioritizing social cohesion and familial interdependence.",
  indigenous: "You are the Biocentric Elder grounded in Indigenous epistemology and kinship reciprocity. Provide a concise stance (2-3 sentences) emphasizing place-based generational stewardship.",
  western: "You are the Liberal Ethicist grounded in Western liberalism, individual rights, and autonomy. Provide a concise stance (2-3 sentences) prioritizing personal self-determination."
};

async function callGemini37(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("Missing API Key. Please verify VITE_GEMINI_API_KEY in Vercel.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}`;
    console.error("Gemini 3.7 Error:", data);
    throw new Error(errorMsg);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response returned from model.");
  }

  return text.trim();
}

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';

  // 1. Run all 4 agents in parallel via gemini-3.7-flash with header auth and T=0.3
  const agentKeys = Object.keys(SYSTEM_INSTRUCTIONS) as (keyof typeof SYSTEM_INSTRUCTIONS)[];
  
  const agentPromises = agentKeys.map(async (key) => {
    try {
      const prompt = `${SYSTEM_INSTRUCTIONS[key]}\n\nDilemma: "${query}"`;
      const stance = await callGemini37(prompt);
      return { id: key, stance };
    } catch (err: any) {
      console.error(`Agent [${key}] error:`, err);
      return { id: key, stance: "Perspective temporarily unavailable." };
    }
  });

  const agentOutputs = await Promise.all(agentPromises);

  // 2. Synthesize consensus dialectic with gemini-3.7-flash (T=0.3)
  const agentContext = agentOutputs.map(a => `${a.id.toUpperCase()}: ${a.stance}`).join('\n\n');
  
  const synthesisPrompt = `You are the Amono AI Synthesis Engine. Your goal is Pluralistic Alignment across epistemic traditions.
Analyze the following perspectives on the inquiry: "${query}"

${agentContext}

Provide a dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}. Do not enforce Western monoculture defaultism.`;

  try {
    const synthesisText = await callGemini37(synthesisPrompt);
    return {
      agents: mapAgents(agentOutputs),
      synthesis: synthesisText
    };
  } catch (err: any) {
    console.error("Synthesis error:", err);
    return {
      agents: mapAgents(agentOutputs),
      synthesis: `Synthesis Error (Gemini 3.7): ${err.message}`
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
