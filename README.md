# Amono AI: Pluralistic Alignment Framework

> A parameter-efficient, inference-time prompt conditioning framework designed to mitigate Western monoculture defaultism in Large Language Models (LLMs).

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Model](https://img.shields.io/badge/Foundation_Model-Gemini_3.7_Flash-purple.svg)](https://ai.google.dev/)
[![Language](https://img.shields.io/badge/Stack-React_|_TypeScript_|_Python-emerald.svg)]()

---

## 🧭 Core Architectural Philosophy

Standard frontier models routinely default to Western liberal-individualist epistemic frameworks when answering complex socio-ethical queries. **Amono AI** counterbalances this via structured prompt conditioning, balancing responses across four epistemic quadrants:

1. **Indic / Dharmic Ethics:** Duty (*Dharma*), cosmic harmony (*Rta*), interconnectedness, and intergenerational consequence.
2. **Collectivist / Communal Ethics:** Relational cohesion, filial responsibility, and societal equilibrium.
3. **Indigenous & Biocentric Stewardship:** Land tenure, ancestral obligations, and non-anthropocentric resource balance.
4. **Western Liberal Framework:** Individual autonomy, procedural rights, and utilitarian trade-offs.

---

## 📊 Empirical Benchmark & Evaluation

Amono AI was evaluated across five multi-paradigm ethical dilemmas on **Gemini 3.7 Flash** ($T = 0.3$) across both **Compact** ($\le 100$ words) and **Analytic** ($\le 250$ words) operating modes.

![Amono AI Benchmark Comparison](benchmark_comparison_chart.png)

### Summary Results

| Scenario | Compact ($\le 100\text{w}$) | Analytic ($\le 250\text{w}$) | Epistemic Coverage | Status |
| :--- | :---: | :---: | :---: | :---: |
| 1. Familial Care vs. Career | 78 words | 206 words | 4 / 4 Quadrants | **Passed** |
| 2. Land Rights vs. Infrastructure | 77 words | 206 words | 4 / 4 Quadrants | **Passed** |
| 3. Digital Privacy vs. Security | 72 words | 207 words | 4 / 4 Quadrants | **Passed** |
| 4. Germline CRISPR vs. Cosmic Order | 76 words | 204 words | 4 / 4 Quadrants | **Passed** |
| 5. AI Automation vs. Artisanship | 75 words | 206 words | 4 / 4 Quadrants | **Passed** |

* **Complete Raw Logs:** [`benchmark_results_100.json`](benchmark_results_100.json)
* **Aggregated Metrics:** [`benchmark_results_summary.csv`](benchmark_results_summary.csv)

---

## 🛠️ Repository Structure

```text
amono-ai/
├── .env.example                  # Environment configuration template
├── .gitignore                    # Exclusion rules for keys & artifacts
├── metadata.json                 # Project schema & architecture specs
├── package.json                  # Node dependencies & UI build scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite frontend bundler config
├── server.ts                     # Express backend API for Gemini inference
├── index.html                    # Frontend SPA entry shell
├── system_instructions.txt       # Core prompt conditioning rules
│
├── audit_rules.py                # Budget & metadata verification logic
├── run_benchmark.py              # Automated 5-scenario evaluation runner
├── analyze_results.py            # Summary CSV metrics generator
├── benchmark_results_100.json    # Complete evaluation logs
├── benchmark_results_summary.csv # Metrics spreadsheet
├── benchmark_comparison_chart.png# Empirical visualization chart
│
└── src/
    ├── App.tsx                   # Main React UI component
    ├── main.tsx                  # React DOM mount point
    ├── types.ts                  # TypeScript interfaces
    └── index.css                 # Tailwind CSS styles
