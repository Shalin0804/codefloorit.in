/* Post-build self-check: `node scripts/check-dist.mjs` (run after `npm run build`).
   Fails if a prerendered page has a broken internal link, a missing/duplicate
   title or canonical, more than one <h1>, or mentions a removed service. */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const pages = readdirSync(dist, { recursive: true }).filter((f) => f.endsWith(".html"));
const REMOVED = /\bAPIs?\b|system integration|cloud|deployment solutions|\bhosting\b/i;

const errors = [];
const titles = new Map();
const exists = (href) => {
  const p = href.split(/[?#]/)[0];
  if (p === "/") return true;
  return existsSync(join(dist, `${p}.html`)) || existsSync(join(dist, p));
};

for (const page of pages) {
  const html = readFileSync(join(dist, page), "utf8");
  const name = relative(dist, join(dist, page));
  const fail = (msg) => errors.push(`${name}: ${msg}`);

  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title) fail("missing <title>");
  else if (titles.has(title)) fail(`duplicate title (same as ${titles.get(title)})`);
  else titles.set(title, name);

  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail("missing or short meta description");
  if (name !== "404.html" && !html.includes('<link rel="canonical" href="https://www.codefloorit.in/')) fail("missing canonical");
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail("expected exactly one <h1>");

  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) if (!exists(href)) fail(`broken link ${href}`);

  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ");
  const hit = text.match(REMOVED);
  if (hit) fail(`mentions removed service term "${hit[0]}"`);
  // structured data must not mention them either
  for (const [, ld] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    JSON.parse(ld);
    if (REMOVED.test(ld)) fail("JSON-LD mentions a removed service term");
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`check-dist: ${pages.length} pages OK`);
