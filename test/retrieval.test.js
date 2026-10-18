import assert from "node:assert/strict";
import test from "node:test";
import { retrieveSources } from "../src/retrieval.js";

test("retrieves the campus academic contact for transcript questions", () => {
  const [first] = retrieveSources("Who handles transcripts at Hyderabad?");
  assert.equal(first.id, "ug-academic-division");
});

test("retrieves the current document portal ahead of the dated regulation", () => {
  const [first] = retrieveSources("Where can I find the latest academic regulations?");
  assert.equal(first.id, "important-academic-documents");
});

test("uses previous context for short follow-up questions", () => {
  const [first] = retrieveSources("Am I eligible?", {
    context: "What are the BITSAT 2026 scholarship conditions for current students?",
  });
  assert.equal(first.id, "bitsat-scholarship-2026");
});

test("returns no result for blank input and caps the requested list", () => {
  assert.deepEqual(retrieveSources("   "), []);
  assert.equal(
    retrieveSources("scholarship transcripts regulations timetable registration", { limit: 100 }).length,
    4,
  );
});
