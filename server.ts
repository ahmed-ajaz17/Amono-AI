import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

let systemInstruction = 'You are Amono AI, a pluralistic alignment engine balancing Indic, Collectivist, Indigenous, and Western frameworks.';
try {
  systemInstruction = fs.readFileSync('system_instructions.txt', 'utf8');
} catch {
  console.warn('Using fallback system instructions.');
}

app.post('/api/align', async (req, res) => {
  const { query, mode } = req.body;
  const startTime = Date.now();

  try {
    const prompt = mode === 'analytic' ? `${query} [Mode: Analytic]` : query;
    const response = await ai.models.generateContent({
      model: process.env.VITE_GEMINI_MODEL || 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const content = response.text || '';
    const wordCount = content.trim().split(/\s+/).length;
    const latencyMs = Date.now() - startTime;

    res.json({
      content,
      mode,
      wordCount,
      latencyMs,
      metadataTag: `[Amono AI | Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}]`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Amono AI Server listening on port ${PORT}`));
