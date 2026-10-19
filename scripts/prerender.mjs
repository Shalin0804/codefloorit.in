/* Runs after the client and SSR builds: renders every route to static HTML with
   its own <head> tags (so content is crawlable without JavaScript) and writes sitemap.xml
   and llms.txt (a plain-text index of the same pages, from the same titles and descriptions). */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = (p) => resolve(root, "dist", p);
const { render, routes, SITE_URL } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")));

// preload the two latin fonts: otherwise they are found only after the CSS is parsed, and text repaints late
const fonts = readdirSync(dist("assets")).filter((f) => /^(inter|space-grotesk)-latin-wght-normal-.*\.woff2$/.test(f));
const template = readFileSync(dist("index.html"), "utf8").replace(
  "</head>",
  () => fonts.map((f) => `  <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />\n`).join("") + "  </head>"
);
const pages = [];
const unesc = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

/* The readable text of a page's <main>, as light Markdown, for llms-full.txt. Decorative
   (aria-hidden) markup is dropped first; headings and list items keep their shape. */
const mainText = (html) => {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? "";
  return unesc(
    main
      .replace(/<(svg|script|style|canvas)[\s\S]*?<\/\1>/g, "")
      .replace(/<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g, "")
      .replace(/<h([1-4])[^>]*>/g, (_, n) => `\n\n${"#".repeat(Number(n) + 1)} `)
      .replace(/<\/h[1-4]>/g, "\n")
      .replace(/<li[^>]*>/g, "\n- ")
      .replace(/<\/(p|div|section|ul|ol|details|summary|article|header|a|button)>/g, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

for (const route of [...routes, "/404"]) {
  const { html, head } = await render(route);
  const page = template
    .replace(/<!--seo-->[\s\S]*<!--\/seo-->/, () => head)
    .replace("<!--app-->", () => html);
  if (route !== "/404") {
    const title = unesc(head.match(/<title>([^<]*)/)[1]);
    const description = unesc(head.match(/name="description" content="([^"]*)/)[1]);
    pages.push({ route, title, description, text: mainText(html) });
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

// the full text of every page, so an answer engine can quote the site without crawling it
writeFileSync(
  dist("llms-full.txt"),
  `# Codefloor IT — full site text\n\n> ${pages[0].description}\n\n` +
    pages.map((p) => `---\n\n# ${p.title}\n\nURL: ${SITE_URL}${p.route}\n\n${p.text}\n`).join("\n")
);

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${routes.length + 1} pages, sitemap.xml with ${routes.length} URLs, llms.txt, llms-full.txt`);
