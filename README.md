# Synapse

AI-powered task prioritization for busy students and professionals — built at **Hack the Future 2026**.

**Live app:** [synapse3-topaz.vercel.app](https://synapse3-topaz.vercel.app/)

Synapse bridges daily to-dos and **weekly goals**: tasks from Google Calendar/Tasks (or manual entry) get **urgency** from due dates and **importance** from Groq JSON scoring, then land on a live **Eisenhower Matrix**. A Groq coach suggests alerts; optional calendar slot proposals respect busy blocks with local fallbacks.

## LLM integration (for reviewers)

Structured Groq calls (not a chat wrapper): system prompt, temperature `0.2`, schema-in-user-message, fence stripping, validation, timeouts.

| Doc | Contents |
|-----|----------|
| [docs/llm-integration.md](./docs/llm-integration.md) | Architecture, context limits, fallbacks, security notes |
| [docs/prompt-changelog.md](./docs/prompt-changelog.md) | v0 spec → v1 shipped prompts |
| [docs/hackathon-origin.md](./docs/hackathon-origin.md) | Event context, stack, team learnings |
| [prompts/](./prompts/) | Per-workflow prompt design notes |
| [shared/llm/](./shared/llm/) | `groqClient.js`, `prompts.js` |

```bash
npm run test:llm   # JSON parse / fence regression
```

## Running locally

1. `npm install`
2. Copy `.env.example` → `.env` and set:
   - `REACT_APP_GROQ_KEY`
   - `REACT_APP_GOOGLE_CLIENT_ID`
3. `npm start` → [http://localhost:3000](http://localhost:3000)

## Notes

- Without Google OAuth, mock tasks load; you can add tasks manually.
- Without Groq, local importance heuristics and coach copy still run.
- Urgency is always computed in code from due dates.

## Stack

React · Google Calendar/Tasks APIs · Groq (OpenAI-compatible chat completions) · Vercel
