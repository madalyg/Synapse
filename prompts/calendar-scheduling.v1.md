# Calendar scheduling prompt (v1)

**Workflow:** `generateCalendarSuggestions` in `src/App.js`  
**Output:** `{ "suggestions": [{ taskId, taskTitle, day, startMinute, endMinute, reason }] }`

## Design

- Sends at most **8** prioritized, incomplete tasks (importance × urgency sort).
- Busy blocks per day as human-readable time ranges (not raw Google event payloads).
- Post-processing: `normalizeAndLimitSuggestions` validates overlaps and caps count — model output is not trusted blindly.
- **15s timeout** → deterministic local slot finder (`buildLocalCalSuggestions`).

## User message (template)

See `buildCalendarSchedulingPrompt()` in `shared/llm/prompts.js`.
