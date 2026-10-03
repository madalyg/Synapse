# Prompt changelog

How Synapse prompts evolved during **Hack the Future 2026** (24h build) and follow-up work.

## v0 — Product spec (Google AI Studio)

- Single long natural-language spec: Eisenhower matrix, Google Calendar/Tasks, LLM suggestion box with example alert strings (misaligned tasks, over-allocated hours, quadrant imbalance).
- Prototype explored Gemini; team standardized on **Groq** for faster JSON-style responses and hackathon quota constraints.

## v1 — Shipped in Synapse (Groq)

Three separate prompts instead of one monolithic call:

1. **Importance scoring** — strict JSON array of `{ taskId, importance, reason }`; urgency remains code-only (fixes spec typo that conflated importance with urgency).
2. **Coach suggestion** — JSON `{ suggestion }` with goals + scored task summary (implements the Devpost “alerts and encouragement” examples).
3. **Calendar scheduling** — JSON `{ suggestions[] }` with minute-based grid, meal-window heuristics, max 6 items, busy-block JSON injected from Calendar sync.

Shared settings:

- System: “strict minified JSON only”
- Temperature `0.2`
- Markdown fence stripping before parse

## v1.1 — Operational hardening (same schema)

- Calendar: **top-8 task cap**, **15s timeout**, local overlap validator
- All flows: keyword **fallback importance** when Groq errors or omits a task id
- Extracted prompts to `shared/llm/prompts.js` + this documentation for review and hiring/portfolio visibility

## Planned (not implemented)

- Monthly/yearly goal tiers in prompts (spec had week/month/year; v1 uses weekly goals only)
- Backend proxy for keys + token budgeting telemetry
- Prompt regression fixtures against recorded anonymized task snapshots
