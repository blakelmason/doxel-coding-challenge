const axios = require("axios");
const cheerio = require("cheerio");
const { generateHistogram } = require("./generateHistogram");

const stopWords = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "with",
  "was",
  "this",
  "that",
  "have",
  "from",
  "they",
  "your",
  "his",
  "her",
  "she",
  "him",
  "has",
  "had",
  "its",
  "all",
  "any",
  "can",
  "will",
  "just",
  "who",
  "our",
  "out",
  "about",
  "get",
  "use",
  "what",
  "when",
  "where",
  "which",
  "their",
  "how",
  "why",
  "been",
  "then",
  "there",
  "were",
  "more",
  "some",
  "would",
  "could",
  "into",
  "them",
  "too",
  "very",
  "than",
  "also",
  "did",
  "does",
  "each",
  "other",
  "only",
  "should",
  "over",
  "such",
  "because",
  "so",
  "if",
  "on",
  "in",
  "at",
  "of",
  "to",
  "is",
  "it",
  "as",
  "an",
  "or",
  "by",
  "be",
  "a",
]);

async function fetchPageText(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $("body").text();
}

function getWordFrequency(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  const freqMap = new Map();

  for (const word of words) {
    freqMap.set(word, (freqMap.get(word) ?? 0) + 1);
  }

  return [...freqMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: node wordFrequency.js <url>");
    process.exit(1);
  }

  try {
    const text = await fetchPageText(url);
    const commonWords = getWordFrequency(text);

    console.log("Top 25 words:");
    for (const [word, count] of commonWords) {
      console.log(`${word}: ${count}`);
    }
    await generateHistogram(commonWords, "histogram.png");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
