# Coach suggestion prompt (v1)

**Workflow:** `generateSuggestions` in `src/App.js`  
**Output:** `{ "suggestion": "<2–4 sentences>" }`

## Design

Derived from the Hack the Future 2026 product spec: alert when goals are under-allocated, celebrate aligned weeks, flag tasks with no goal match, and warn when the Not Important / Not Urgent quadrant dominates.

Examples we asked the model to emulate (paraphrased in prompt via JSON task/quadrant data):

- Hours allotted to a goal may be insufficient for the week.
- Positive reinforcement when the matrix aligns with stated goals.
- Too many low-priority tasks — consider dropping or delegating.
- Tasks that do not map to any weekly goal.

## User message (template)

See `buildCoachSuggestionPrompt()` in `src/llm/prompts.js`.
