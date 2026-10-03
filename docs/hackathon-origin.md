# Hack the Future 2026 — Synapse origin

**Event:** Hack the Future 2026  
**Team:** Built collaboratively in ~24 hours; consolidated multiple member prototypes into one app.  
**Live demo:** [synapse3-topaz.vercel.app](https://synapse3-topaz.vercel.app/)  
**Repo:** [github.com/madalyg/Synapse](https://github.com/madalyg/Synapse)

## Problem

Busy students and professionals already live in Google Calendar and Tasks, but those tools optimize for **scheduling**, not **goal alignment**. Synapse connects daily tasks to **weekly goals** and an **Eisenhower Matrix**, with an LLM acting as a productivity coach—not a generic chatbot.

## What we shipped

- Google OAuth 2.0 + Calendar + Tasks sync (with manual/mock mode for judges and local dev)
- Deterministic **urgency** from due dates; **importance** from Groq JSON scoring vs goals
- Visual 2×2 matrix with quadrant placement rules (importance/urgency thresholds ≥ 3)
- Groq-powered **coach** suggestions and **calendar slot** proposals with local fallbacks
- React web app on Vercel; shared logic in `shared/` for a React Native mobile track

## LLM approach (summary)

We iterated from one Google AI Studio mega-prompt to **three small, schema-bound Groq calls** with temperature 0.2, explicit JSON shapes, and code-side validation. Details: [llm-integration.md](./llm-integration.md).

## Team learnings (from our Devpost draft)

- Prompt refinement and knowing when to use AI vs hand-written logic (urgency, overlap checks)
- OAuth and API integration under time pressure
- Merging four branch prototypes via Git without blocking the demo

## Related prior work

[Maddi’s TimeSlice](https://github.com/madalyg/TimeSlice) (TechTogether Seattle) explored AI-assisted daily time blocking; Synapse focuses on **goal-weighted prioritization** and Google workspace integration.
