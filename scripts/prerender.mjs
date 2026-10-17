/* Runs after the client and SSR builds: renders every route to static HTML with
   its own <head> tags (so content is crawlable without JavaScript) and writes sitemap.xml
   and llms.txt (a plain-text index of the same pages, from the same titles and descriptions). */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = (p) => resolve(root, "dist", p);
const { render, routes, SITE_URL } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")));

const template = readFileSync(dist("index.html"), "utf8");
const pages = [];
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&amp;/g, "&");

for (const route of [...routes, "/404"]) {
  const { html, head } = await render(route);
  const page = template
    .replace(/<!--seo-->[\s\S]*<!--\/seo-->/, () => head)
    .replace("<!--app-->", () => html);
  if (route !== "/404") {
    const title = unesc(head.match(/<title>([^<]*)/)[1]);
    const description = unesc(head.match(/name="description" content="([^"]*)/)[1]);
    pages.push({ route, title, description });
  }
  const file = dist(route === "/" ? "index.html" : `${route.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
}

// no <lastmod>: the build date is not when a page changed, and a date that is always "today" gets ignored
writeFileSync(
  dist("sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`).join("\n")}
</urlset>
`
);

const section = (name, test) =>
  `## ${name}\n\n${pages
    .filter((p) => test(p.route))
    .map((p) => `- [${p.title}](${SITE_URL}${p.route}): ${p.description}`)
    .join("\n")}\n`;
writeFileSync(
  dist("llms.txt"),
  [
    `# Codefloor IT\n\n> ${pages[0].description}\n`,
    section("Company", (r) => ["/", "/about", "/solutions", "/contact"].includes(r)),
    section("Services", (r) => r.startsWith("/services")),
    section("Work", (r) => r.startsWith("/work")),
    section("Insights", (r) => r.startsWith("/insights")),
  ].join("\n")
);

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${routes.length + 1} pages, sitemap.xml with ${routes.length} URLs, llms.txt`);
