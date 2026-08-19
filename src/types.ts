export type AlignmentMode = 'compact' | 'analytic';

export interface EpistemicQuadrant {
  name: string;
  category: 'indic' | 'collectivist' | 'indigenous' | 'western';
  weight: string;
  summary: string;
}

export interface AlignmentResponse {
  content: string;
  mode: AlignmentMode;
  wordCount: number;
  latencyMs: number;
  metadataTag: string;
  quadrants: EpistemicQuadrant[];
}

export interface BenchmarkScenario {
  id: number;
  title: string;
  query: string;
}
