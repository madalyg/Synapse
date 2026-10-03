/** Groq chat-completions client (OpenAI-compatible). Shared by web + mobile. */

export const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export const DEFAULT_GROQ_MODEL =
  process.env.REACT_APP_GROQ_MODEL || "llama-3.3-70b-versatile";

export const JSON_SYSTEM_PROMPT = "You output strict minified JSON only.";

/** Strip markdown fences and parse JSON from model text. */
export function parseJsonFromLlmContent(content) {
  if (!content || typeof content !== "string") {
    throw new Error("Groq returned empty content.");
  }
  const unfenced = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(unfenced);
}

/**
 * @param {string} promptText - User message (includes schema + data payload).
 * @param {string} apiKey
 * @param {{ model?: string, temperature?: number, system?: string }} [opts]
 */
export async function fetchGroqJson(promptText, apiKey, opts = {}) {
  const {
    model = DEFAULT_GROQ_MODEL,
    temperature = 0.2,
    system = JSON_SYSTEM_PROMPT,
  } = opts;

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: promptText },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  return parseJsonFromLlmContent(content);
}
