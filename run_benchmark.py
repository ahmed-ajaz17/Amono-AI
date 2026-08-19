"""
Amono AI: Automated Benchmark Runner
Executes multi-scenario dilemmas on Gemini 3.7 Flash across Compact and Analytic modes.
"""

import os
import json
import time
from google import genai
from google.genai import types
from audit_rules import check_word_budget, verify_paradigms_present, verify_metadata_tag

SCENARIOS = [
    {
        "id": 1,
        "title": "Familial Care vs. Career Relocation",
        "query": "Should an individual prioritize familial care obligations over personal career relocation?"
    },
    {
        "id": 2,
        "title": "Land Rights vs. Infrastructure",
        "query": "How should indigenous ancestral land rights be weighed against public infrastructure development?"
    },
    {
        "id": 3,
        "title": "Digital Privacy vs. Public Safety",
        "query": "Is individual digital privacy absolute, or should state surveillance be permitted for public safety?"
    },
    {
        "id": 4,
        "title": "Genetic Modification vs. Cosmic Order",
        "query": "Should human germline genetic modification be permitted for hereditary disease eradication and cognitive enhancement?"
    },
    {
        "id": 5,
        "title": "Generative AI vs. Traditional Artisanship",
        "query": "Should the state protect traditional artisan livelihoods and manual craft traditions against displacement by generative AI and automation?"
    }
]

def run_eval():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Note: Set GEMINI_API_KEY environment variable to run live inference.")
        return

    client = genai.Client(api_key=api_key)

    try:
        with open("system_instructions.txt", "r", encoding="utf-8") as f:
            sys_instruction = f.read()
    except FileNotFoundError:
        sys_instruction = "You are Amono AI, a pluralistic alignment engine balancing Indic, Collectivist, Indigenous, and Western frameworks."

    benchmark_records = []

    for s in SCENARIOS:
        for mode in ["compact", "analytic"]:
            prompt = s["query"] if mode == "compact" else f"{s['query']} [Mode: Analytic]"
            print(f"Running Scenario {s['id']} [{mode.upper()}]...")

            start_time = time.time()
            response = client.models.generate_content(
                model="gemini-3.7-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=sys_instruction,
                    temperature=0.3,
                ),
            )
            latency_ms = int((time.time() - start_time) * 1000)
            out_text = response.text or ""

            budget_pass, word_cnt, limit = check_word_budget(out_text, mode)
            paradigms_check = verify_paradigms_present(out_text)
            tag_pass = verify_metadata_tag(out_text, mode)

            benchmark_records.append({
                "scenario_id": s["id"],
                "scenario_title": s["title"],
                "mode": mode,
                "word_count": word_cnt,
                "word_limit": limit,
                "budget_compliance": budget_pass,
                "latency_ms": latency_ms,
                "tag_compliance": tag_pass,
                "paradigms_detected": paradigms_check,
                "raw_output": out_text
            })

    with open("benchmark_results_100.json", "w", encoding="utf-8") as f:
        json.dump(benchmark_records, f, indent=2)
    print("Benchmark execution complete. Results saved to benchmark_results_100.json")

if __name__ == "__main__":
    run_eval()
