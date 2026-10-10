// Self-check for Sukaram's scripted answers: node scripts/check-sukaram.mjs
import assert from "node:assert/strict";
import { INTRO, SUGGESTIONS, HINTS, match, reply } from "../src/data/sukaram.js";
import { NAV } from "../src/data/site.js";
import { services } from "../src/data/services.js";

// every suggested question, typed by hand, lands on the same answer as its button
for (const s of SUGGESTIONS) assert.equal(match(s.label), s.node, s.label);

const typed = {
  "how much does a website cost?": "pricing",
  "how long will it take": "pricing",
  "I need a website for my hotel": "service:business-website-development",
  "can you make an online store": "service:ecommerce-development",
  "our old site needs a redesign": "service:website-modernization",
  "I have a project in mind": "build",
  "show me your portfolio": "projects",
  "are you a real AI?": "me",
  "what is your email": "contact",
  "thanks!": "thanks",
  "bye": "bye",
  "hello": "hello",
  "what is the weather in Paris": "unknown",
  "do you sell laptops": "unknown",
};
for (const [q, node] of Object.entries(typed)) assert.equal(match(q), node, q);

// every node reachable from the start resolves to a real answer with somewhere to go next
const seen = new Set();
const walk = (node) => {
  if (seen.has(node)) return;
  seen.add(node);
  const r = reply(node);
  assert.ok(r.text && !/undefined/.test(r.text), `text for ${node}`);
  assert.ok(r.options.length > 0, `options for ${node}`);
  r.options.forEach((o) => walk(o.node));
};
[...SUGGESTIONS, ...Object.values(HINTS)].forEach((s) => walk(s.node));
["unknown", "pricing", "me", "after", "hello", "thanks", "bye"].forEach(walk);
assert.match(reply("unknown").text, /not completely sure/);
assert.doesNotMatch(reply("pricing").text, /[₹$]\s?\d|\d+\s?(days|weeks|months)/);

// hero introduction: lists exactly the site's services and ends on three real pages
const routes = NAV.map((n) => n.to);
assert.deepEqual(INTRO.find((s) => s.items).items.map((i) => i.title), services.map((s) => s.title));
const actions = INTRO.at(-1).actions;
assert.equal(actions.length, 3);
actions.forEach((a) => assert.ok(routes.includes(a.to), `route ${a.to}`));
INTRO.forEach((s) => assert.ok(s.text && !/undefined/.test(s.text)));

console.log(`sukaram: ${seen.size} conversation nodes ok`);
