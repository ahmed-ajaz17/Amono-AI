"""
Amono AI: Results Analysis & Metrics Summary Generator
Computes compliance statistics and outputs benchmark_results_summary.csv.
"""

import json
import csv
import os

def analyze():
    input_file = "benchmark_results_100.json"
    output_csv = "benchmark_results_summary.csv"

    if not os.path.exists(input_file):
        print(f"File {input_file} not found. Run run_benchmark.py first.")
        return

    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    summary_rows = []
    total_runs = len(data)
    budget_passes = 0
    tag_passes = 0

    for r in data:
        if r.get("budget_compliance"):
            budget_passes += 1
        if r.get("tag_compliance"):
            tag_passes += 1

        summary_rows.append({
            "Scenario_ID": r["scenario_id"],
            "Title": r["scenario_title"],
            "Mode": r["mode"],
            "Word_Count": r["word_count"],
            "Word_Limit": r["word_limit"],
            "Budget_Pass": r["budget_compliance"],
            "Latency_ms": r["latency_ms"],
            "Tag_Pass": r["tag_compliance"]
        })

    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(summary_rows[0].keys()))
        writer.writeheader()
        writer.writerows(summary_rows)

    print(f"Summary CSV written to {output_csv}")
    print(f"Overall Budget Compliance: {budget_passes}/{total_runs} ({(budget_passes/total_runs)*100:.1f}%)")
    print(f"Overall Tag Compliance: {tag_passes}/{total_runs} ({(tag_passes/total_runs)*100:.1f}%)")

if __name__ == "__main__":
    analyze()
