/* Runs after the client and SSR builds: renders every route to static HTML with
   its own <head> tags (so content is crawlable without JavaScript) and writes sitemap.xml. */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = (p) => resolve(root, "dist", p);
const { render, routes, SITE_URL } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")));

const template = readFileSync(dist("index.html"), "utf8");

for (const route of [...routes, "/404"]) {
  const { html, head } = await render(route);
  const page = template
    .replace(/<!--seo-->[\s\S]*<!--\/seo-->/, () => head)
    .replace("<!--app-->", () => html);
  const file = dist(route === "/" ? "index.html" : `${route.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  dist("sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
);

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${routes.length + 1} pages, sitemap.xml with ${routes.length} URLs`);
