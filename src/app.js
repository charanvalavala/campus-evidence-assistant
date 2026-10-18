import { retrieveSources } from "./retrieval.js";

const form = document.querySelector("#search-form");
const input = document.querySelector("#query");
const results = document.querySelector("#results");
const status = document.querySelector("#status");

function render(query) {
  const matches = retrieveSources(query, { limit: 3 });
  results.replaceChildren();
  if (matches.length === 0) {
    status.textContent = "No matching source found in this small corpus. Try different terms or use the official BITS portals linked below.";
    return;
  }
  status.textContent = `${matches.length} relevant official ${matches.length === 1 ? "source" : "sources"} found for “${query.trim()}”. Results are lexical matches, not an answer or eligibility decision.`;
  for (const [index, source] of matches.entries()) {
    const item = document.createElement("li");
    item.className = "result-card";
    item.style.animationDelay = `${index * 55}ms`;
    const meta = document.createElement("div");
    meta.className = "result-meta";
    const label = document.createElement("span");
    label.textContent = `OFFICIAL SOURCE · MATCH ${index + 1}`;
    const date = document.createElement("span");
    date.textContent = `CHECKED ${source.checkedAt}`;
    meta.append(label, date);
    const heading = document.createElement("h3");
    heading.textContent = source.title;
    const excerpt = document.createElement("p");
    excerpt.textContent = source.text;
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(document.createTextNode("Open the official page "));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    link.append(arrow);
    item.append(meta, heading, excerpt, link);
    results.append(item);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render(input.value);
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.query;
    render(input.value);
    input.focus();
  });
});
