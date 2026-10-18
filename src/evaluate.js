import { retrieveSources } from "./retrieval.js";

const cases = [
  { query: "Who handles course registration and transcripts at Hyderabad?", relevant: ["ug-academic-division"] },
  { query: "Where are the current academic regulations and timetable?", relevant: ["important-academic-documents"] },
  { query: "Is this 2023 academic regulation still current?", relevant: ["academic-regulations-2023", "important-academic-documents"] },
  { query: "What are the BITSAT 2026 scholarship rules?", relevant: ["bitsat-scholarship-2026"] },
  { query: "Does an admission scholarship page decide current student eligibility?", relevant: ["bitsat-scholarship-2026"] },
  { query: "Where do I ask about an academic counselling board matter?", relevant: ["ug-academic-division"] },
  { query: "Where can I find official academic bulletins?", relevant: ["important-academic-documents"] },
  { query: "I need my grades and transcript from BITS Hyderabad", relevant: ["ug-academic-division"] },
  { query: "Am I eligible?", context: "What are the BITSAT 2026 scholarship conditions for current students?", relevant: ["bitsat-scholarship-2026"] },
];

let hits = 0;
let reciprocalRank = 0;
for (const item of cases) {
  const found = retrieveSources(item.query, { context: item.context ?? "", limit: 3 }).map((source) => source.id);
  const index = found.findIndex((id) => item.relevant.includes(id));
  if (index >= 0) {
    hits += 1;
    reciprocalRank += 1 / (index + 1);
  }
  console.log(`${index >= 0 ? "PASS" : "FAIL"} ${item.query} → ${found.join(", ") || "(no results)"}`);
}
console.log(`\nLabeled questions: ${cases.length}`);
console.log(`Hit@3: ${(hits / cases.length).toFixed(3)}`);
console.log(`MRR@3: ${(reciprocalRank / cases.length).toFixed(3)}`);
console.log("Scope: evidence-source retrieval only; not answer correctness.");
