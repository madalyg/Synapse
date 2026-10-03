import assert from "node:assert/strict";
import {
  parseJsonFromLlmContent,
} from "../src/llm/groqClient.js";

assert.deepEqual(parseJsonFromLlmContent('{"a":1}'), { a: 1 });

assert.deepEqual(
  parseJsonFromLlmContent('```json\n{"scores":[{"taskId":"t1","importance":3}]}\n```'),
  { scores: [{ taskId: "t1", importance: 3 }] }
);

assert.throws(() => parseJsonFromLlmContent(""), /empty content/);
assert.throws(() => parseJsonFromLlmContent("not json"), SyntaxError);

console.log("parse-llm-json: ok");
