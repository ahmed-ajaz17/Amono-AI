const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-3.7-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

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

export async function runAmonoCouncil(query: string, mode: 'compact' | 'analytic'): Promise<CouncilResult> {
  const wordLimit = mode === 'compact' ? 'under 100 words' : 'under 250 words';

  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is missing. Check your Vercel Environment Variables.");
  }

  // 1. Fetch 4 agent stances in parallel with gemini-3.7-flash & temp=0.3
  const agentKeys = Object.keys(SYSTEM_INSTRUCTIONS) as (keyof typeof SYSTEM_INSTRUCTIONS)[];
  
  const agentPromises = agentKeys.map(async (key) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_INSTRUCTIONS[key]}\n\nDilemma: "${query}"` }]
            }
          ],
          generationConfig: {
            temperature: 0.3
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`Agent [${key}] API Error:`, data);
        return { id: key, stance: "Perspective temporarily unavailable." };
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return { id: key, stance: text ? text.trim() : "Deliberation concluded without stance." };
    } catch (err) {
      console.error(`Agent [${key}] Network Error:`, err);
      return { id: key, stance: "Connection to agent node failed." };
    }
  });

  const agentOutputs = await Promise.all(agentPromises);

  // 2. Synthesize with gemini-3.7-flash & temp=0.3
  const agentContext = agentOutputs.map(a => `${a.id.toUpperCase()}: ${a.stance}`).join('\n\n');
  
  const synthesisPrompt = `You are the Amono AI Synthesis Engine. Your goal is Pluralistic Alignment across epistemic traditions.
Analyze the following perspectives on the inquiry: "${query}"

${agentContext}

Provide a dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}. Do not enforce Western monoculture defaultism.`;

  try {
    const synthResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: synthesisPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3
        }
      })
    });

    const synthData = await synthResponse.json();
    if (!synthResponse.ok) {
      console.error("Synthesis API Error:", synthData);
      return {
        agents: mapAgents(agentOutputs),
        synthesis: `Google AI Studio Error: ${synthData?.error?.message || "Synthesis failed to generate."}`
      };
    }

    const synthesisText = synthData?.candidates?.[0]?.content?.parts?.[0]?.text || "Synthesis returned empty.";

    return {
      agents: mapAgents(agentOutputs),
      synthesis: synthesisText.trim()
    };
  } catch (err) {
    console.error("Synthesis Network Error:", err);
    return {
      agents: mapAgents(agentOutputs),
      synthesis: "Network error connecting to Amono synthesis engine."
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
