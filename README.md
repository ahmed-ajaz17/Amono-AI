# Amono AI: Parameter-Efficient Framework for Mitigating Monoculture Bias in LLMs

**Amono AI** is a modular system layer designed to de-center Western defaultism and monoculture bias in Large Language Models (LLMs). Rather than retraining billions of weights, Amono AI intercepts prompts and dynamically conditions foundation models (such as Gemini 3.6 Flash) across pluralistic non-Western context layers in real time.

---

##  Key Features

* **Dynamic Context Injection:** Injects multi-perspective system instructions at the API level without modifying base model parameters.
* **Pluralistic Domain Alignment:** Evaluates queries across distinct socio-philosophical domains:
  1. **Indic / Dharmic Ethics:** Duty-centric (*Dharma*) and relational responsibility.
  2. **Collectivist / Communal Ethics:** Social balance, filial responsibility, and community welfare.
  3. **Indigenous & Biocentric Stewardship:** Non-anthropocentric nature rights and customary ecology.
  4. **Western Liberal Framework:** Presented as *one* regional perspective among equals.
* **Strict Output Constraints:** Configured with an operational **100-word response limit** for concise, high-efficiency comparisons.

---

##  Configuration & System Prompt

The core logic resides in `system_instructions.txt`, which conditions the Gemini engine to avoid treating Western individualistic standards as universal baselines.

---

##  India Book of Records (IBR) Evidence Submission

This repository serves as the official open-source codebase and evidence record for the **India Book of Records** claim:
> *"First Modular Parameter-Efficient System Framework (Amono AI) for Mitigating Western-Centricity and Monoculture Bias across Pluralistic Non-Western Context Layers in Large Language Models."*

---

##  License

This project is licensed under the Apache License 2.0 - see the `LICENSE` file for details.

##  Operational Modes

Amono AI supports two parameter-efficient execution modes:

| Mode | Word Limit | Trigger | Best For |
| :--- | :--- | :--- | :--- |
| **Compact (Default)** | $\le 100\text{ words}$ | Standard prompt | Real-time edge inference, low token consumption |
| **Analytic** | $\le 250\text{ words}$ | Prepend `[Mode: Analytic]` | Deep research, ethical deliberation, academic case studies |

### Example Usage:
* **Compact Query:** `"Is personal career ambition more important than family duty?"`
* **Analytic Query:** `"[Mode: Analytic] Is personal career ambition more important than family duty?"`
