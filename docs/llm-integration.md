# LLM integration (Groq)

Synapse uses [Groq](https://groq.com/)’s OpenAI-compatible chat completions API for three structured JSON workflows. Urgency scoring stays **deterministic** (due-date math); the LLM handles **goal alignment**, **coaching copy**, and **calendar slot proposals**.

## Architecture

```text
User goals + Google Tasks/Calendar
        │
        ▼
Local urgency (1–4) ──► Eisenhower quadrants
        │
        ▼
Groq (importance JSON) ──► merge + fallback keywords
        │
        ├──► Coach suggestion (JSON string)
        └──► Calendar suggestions (JSON array) ──► validate overlaps locally
```

| Step | Model role | Fallback if API missing / fails |
|------|------------|----------------------------------|
| Importance | Score 1–4 vs weekly goals | `buildFallbackImportance` (keyword overlap) |
| Coach | 2–4 sentence alerts | `buildLocalSuggestion` / matrix insight copy |
| Calendar | Up to 6 slot proposals | `buildLocalCalSuggestions` + 15s timeout |

## API configuration

| Variable | Purpose |
|----------|---------|
| `REACT_APP_GROQ_KEY` | Bearer token (demo: client-side; production should proxy on a backend) |
| `REACT_APP_GROQ_MODEL` | Optional; default `llama-3.3-70b-versatile` |

Implementation: `src/llm/groqClient.js`

- **System prompt:** `You output strict minified JSON only.`
- **Temperature:** `0.2` (reduce creative drift on schema-bound tasks)
- **Parsing:** strip `` ```json `` fences, then `JSON.parse`; throws on invalid JSON

## Prompt catalog

| Version | File | Builder |
|---------|------|---------|
| Importance v1 | [prompts/importance-scoring.v1.md](../prompts/importance-scoring.v1.md) | `buildImportanceScoringPrompt` |
| Coach v1 | [prompts/coach-suggestion.v1.md](../prompts/coach-suggestion.v1.md) | `buildCoachSuggestionPrompt` |
| Calendar v1 | [prompts/calendar-scheduling.v1.md](../prompts/calendar-scheduling.v1.md) | `buildCalendarSchedulingPrompt` |

Evolution notes: [prompt-changelog.md](./prompt-changelog.md)

## Context window discipline

We intentionally **limit** what goes into each request:

- **Tasks for calendar:** top 8 open tasks by `importance * 2 + urgency`, fields reduced to id/title/scores/quadrant.
- **Coach:** scored tasks with title, due, urgency, importance, quadrant (no long notes unless present on task).
- **Importance:** goals + task id/title/due/notes only.

This keeps prompts small for hackathon-era rate limits and reduces hallucinated fields.

## Reliability patterns

1. **Structured output in the user message** — JSON shape spelled out in the prompt, not only in system text.
2. **Server-side validation** — calendar suggestions checked against busy blocks after parse.
3. **Timeout race** — calendar call aborted at 15s.
4. **Degraded mode** — app remains usable with mock data and local scoring when `REACT_APP_GROQ_KEY` is unset.

## Security (demo vs production)

This repo runs in the browser for Hack the Future / Vercel demos. **Do not ship production API keys in frontend bundles.** A production deployment should:

- Hold Groq (or Anthropic/OpenAI) keys on a server or edge function
- Enforce per-user rate limits and request size caps
- Log prompt **hashes** and latency, not full user task text, where privacy requires it

## Local testing

```bash
node scripts/parse-llm-json.test.mjs
```

Validates fence-stripping and JSON parse helpers used by `fetchGroqJson`.
