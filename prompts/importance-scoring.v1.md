# Importance scoring prompt (v1)

**Workflow:** `scoreTaskImportanceWithGroq` in `src/App.js`  
**Output:** `{ "scores": [{ "taskId", "importance": 1-4, "reason" }] }`

## Design

- **Urgency** is computed locally from due dates (not LLM).
- **Importance** is LLM-scored against the user’s **weekly goals** and weekly hour budgets.
- Every task ID must appear in the response; invalid IDs fall back to keyword matching (`buildFallbackImportance`).

## User message (template)

See `buildImportanceScoringPrompt()` in `src/llm/prompts.js`.

## Context budget

- Full goals array (typically small).
- Tasks trimmed to `id`, `title`, `due`, `notes` only (no matrix state).
