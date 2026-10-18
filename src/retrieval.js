import { sources } from "./sources.js";

const stopWords = new Set("a an and are as at be by for from how i in is it of on or the to what when where who with current latest find can do does am me this that".split(" "));
const tokenPattern = /[\p{L}\p{N}]+/gu;
const followUpPattern = /^(?:am i|can i|do i|would i|will i|what about|how about|does (?:it|that|this)|is that|and me)\b/i;

export function tokenize(text) {
  return (text.toLocaleLowerCase().match(tokenPattern) ?? []).filter(
    (token) => token.length > 1 && !stopWords.has(token),
  );
}

function scoreSources(queryTokens) {
  const documents = sources.map((source) => ({
    source,
    terms: tokenize(`${source.title} ${source.text}`),
  }));
  const averageLength = documents.reduce((sum, doc) => sum + doc.terms.length, 0) / documents.length;
  const documentFrequency = new Map();
  for (const doc of documents) {
    for (const term of new Set(doc.terms)) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }
  const k1 = 1.5;
  const b = 0.75;
  return documents.map(({ source, terms }) => {
    const frequencies = new Map();
    for (const term of terms) frequencies.set(term, (frequencies.get(term) ?? 0) + 1);
    let score = 0;
    for (const term of new Set(queryTokens)) {
      const frequency = frequencies.get(term) ?? 0;
      if (!frequency) continue;
      const df = documentFrequency.get(term) ?? 0;
      const idf = Math.log(1 + (documents.length - df + 0.5) / (df + 0.5));
      const denominator = frequency + k1 * (1 - b + (b * terms.length) / averageLength);
      score += (idf * frequency * (k1 + 1)) / denominator;
    }
    return { source, score };
  });
}

export function retrieveSources(query, { context = "", limit = 3 } = {}) {
  const cleaned = query.trim();
  if (!cleaned || !Number.isInteger(limit) || limit < 1) return [];
  const searchText = followUpPattern.test(cleaned) ? `${context} ${cleaned}` : cleaned;
  const queryTokens = tokenize(searchText);
  if (!queryTokens.length) return [];
  const asksForLatest = /\b(?:current|latest|newest|up.to.date)\b/i.test(searchText);
  return scoreSources(queryTokens)
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (asksForLatest) {
        const leftPortal = left.source.id === "important-academic-documents";
        const rightPortal = right.source.id === "important-academic-documents";
        if (leftPortal !== rightPortal) return rightPortal ? 1 : -1;
      }
      return right.score - left.score || left.source.id.localeCompare(right.source.id);
    })
    .slice(0, Math.min(limit, 10))
    .map(({ source, score }) => ({ ...source, score }));
}
