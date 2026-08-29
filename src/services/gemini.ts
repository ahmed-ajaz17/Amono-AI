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

  // 1. Fetch all 4 agent perspectives concurrently using 3.7 and temp = 0.3
  const agentKeys = Object.keys(SYSTEM_INSTRUCTIONS) as (keyof typeof SYSTEM_INSTRUCTIONS)[];
  
  const agentPromises = agentKeys.map(async (key) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Stance deliberation unavailable.";
    return { id: key, stance: text.trim() };
  });

  const agentOutputs = await Promise.all(agentPromises);

  // 2. Synthesize all perspectives into equilibrium consensus using temp = 0.3
  const agentContext = agentOutputs.map(a => `${a.id.toUpperCase()}: ${a.stance}`).join('\n\n');
  
  const synthesisPrompt = `You are the Amono AI Synthesis Engine. Your goal is Pluralistic Alignment across epistemic traditions.
Analyze the following perspectives on the inquiry: "${query}"

${agentContext}

Provide a dialectical equilibrium synthesis resolving or balancing these values in ${wordLimit}. Do not enforce Western monoculture defaultism.`;

  const synthResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: synthesisPrompt }] }],
      generationConfig: {
        temperature: 0.3
      }
    })
  });

  const synthData = await synthResponse.json();
  const synthesisText = synthData?.candidates?.[0]?.content?.parts?.[0]?.text || "Synthesis failed to generate.";

  return {
    agents: agentOutputs.map(a => ({
      id: a.id,
      name: a.id === 'indic' ? 'Dharmic Sage' : a.id === 'collectivist' ? 'Communal Guardian' : a.id === 'indigenous' ? 'Biocentric Elder' : 'Liberal Ethicist',
      tradition: a.id === 'indic' ? 'Indic Epistemology' : a.id === 'collectivist' ? 'Collectivist Ethics' : a.id === 'indigenous' ? 'Indigenous Epistemology' : 'Western Liberalism',
      stance: a.stance
    })),
    synthesis: synthesisText.trim()
  };
}
