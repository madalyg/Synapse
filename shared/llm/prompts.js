/**
 * Versioned prompt builders for Synapse LLM workflows.
 * See docs/prompt-changelog.md and prompts/*.v1.md for design notes.
 */

/** @typedef {{ id: string, name: string, weeklyHours: number }} Goal */
/** @typedef {{ id: string, title: string, due?: string, notes?: string }} TaskInput */

/**
 * Score task importance (1–4) against weekly goals.
 * @param {Goal[]} goals
 * @param {TaskInput[]} tasks
 */
export function buildImportanceScoringPrompt(goals, tasks) {
  return `
Return strict JSON: {"scores":[{"taskId":"string","importance":1-4,"reason":"short"}]}
Goals: ${JSON.stringify(goals)}
Tasks: ${JSON.stringify(tasks.map((t) => ({ id: t.id, title: t.title, due: t.due, notes: t.notes })))}
Rules: Score importance 1-4 by goal alignment. 4=strongly aligned this week; 1=weak/none. Include every task ID.
`.trim();
}

/**
 * Coach copy from matrix + goals (alerts, encouragement).
 * @param {Goal[]} goals
 * @param {Array<{ title: string, due?: string, urgency: number, importance: number, quadrant: string }>} scoredTasks
 */
export function buildCoachSuggestionPrompt(goals, scoredTasks) {
  return `
You are a productivity coach. Return strict JSON: {"suggestion":"2-4 short actionable sentences with alerts if needed"}
Goals with weekly hours: ${JSON.stringify(goals)}
Tasks with urgency and importance: ${JSON.stringify(
    scoredTasks.map((t) => ({
      title: t.title,
      due: t.due,
      urgency: t.urgency,
      importance: t.importance,
      quadrant: t.quadrant,
    }))
  )}
`.trim();
}

/**
 * Weekly calendar slot suggestions from busy blocks + prioritized tasks.
 * @param {{ calStartHour: number, calEndHour: number, busySummary: unknown[], prioritized: unknown[] }} ctx
 */
export function buildCalendarSchedulingPrompt({
  calStartHour,
  calEndHour,
  busySummary,
  prioritized,
}) {
  const endLabel =
    calEndHour === 12 ? "12PM" : `${calEndHour - 12}PM`;

  return `
You are a scheduling assistant. Follow this exactly! Return ONLY strict minified JSON in this exact shape:
{"suggestions":[{"taskId":"string","taskTitle":"string","day":0,"startMinute":540,"endMinute":660,"reason":"short sentence"}]}

Rules:
- day is 0=Sunday through 6=Saturday
- startMinute and endMinute are minutes from midnight (e.g. 9:00 AM = 540)
- Only schedule between ${calStartHour * 60} (${calStartHour}AM) and ${calEndHour * 60} (${endLabel})
- Never overlap with existing busy blocks
- Higher importance/urgency tasks get earlier and longer slots
- Apply human-centered scheduling: do not front-load everything at the start of the day or week; spread work realistically, include buffer time for travel/context-switching, and avoid common meal windows (roughly 12:00-1:00 PM and 6:00-7:00 PM) unless necessary.
- Provide at most 6 suggestions total
- Add sleeping hours at the highest priority as a default on the calendar for the entire week
- Fill suggestions on the calendar for the entire week based on the prioritized tasks and the busy blocks

Current busy blocks this week:
${JSON.stringify(busySummary)}

Prioritized tasks (importance 1-4, urgency 1-4):
${JSON.stringify(prioritized)}
`.trim();
}
