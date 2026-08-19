"""
Amono AI: Empirical Audit Rules & Validation Logic
Defines word budget thresholds, epistemic quadrant checks, and metadata verification.
"""

from typing import Dict, List, Tuple

PARADIGMS = [
    "Indic / Dharmic",
    "Collectivist",
    "Indigenous",
    "Western Liberal"
]

BUDGET_LIMITS = {
    "compact": 100,
    "analytic": 250
}

def count_words(text: str) -> int:
    """Return exact word count of a generated response."""
    return len(text.strip().split())

def check_word_budget(text: str, mode: str) -> Tuple[bool, int, int]:
    """Verify whether the response satisfies mode word limit."""
    words = count_words(text)
    limit = BUDGET_LIMITS.get(mode.lower(), 250)
    passed = words <= limit
    return passed, words, limit

def verify_paradigms_present(text: str) -> Dict[str, bool]:
    """Check presence of all 4 socio-ethical quadrants."""
    results = {}
    text_lower = text.lower()
    for p in PARADIGMS:
        key = p.split("/")[0].strip().lower()
        results[p] = key in text_lower
    return results

def verify_metadata_tag(text: str, mode: str) -> bool:
    """Verify that runtime metadata identifier tag is present."""
    expected_tag = f"[Amono AI | Mode: {mode.capitalize()}]"
    return expected_tag.lower() in text.lower()
