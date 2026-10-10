import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router";
import App from "./App";
import { SeoSink, headHtml, SITE_URL } from "./lib/seo";
import { services } from "./data/services";
import { projects } from "./data/projects";
import { articles } from "./data/insights";

/** Every indexable URL on the site — drives prerendering and sitemap.xml. */
export const routes = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/solutions",
  "/work",
  ...projects.map((p) => `/work/${p.slug}`),
  "/about",
  "/insights",
  ...articles.map((a) => `/insights/${a.slug}`),
  "/contact",
  "/privacy-policy",
  "/terms",
];

export { SITE_URL };

export async function render(url) {
  const sink = { current: null };
  const { prelude } = await prerender(
    <StrictMode>
      <SeoSink value={sink}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </SeoSink>
    </StrictMode>
  );
  return { html: await new Response(prelude).text(), head: headHtml(sink.current) };
}
