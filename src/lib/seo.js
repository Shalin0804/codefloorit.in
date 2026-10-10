import { createContext, useContext, useEffect } from "react";

export const SITE_URL = "https://codefloorit.in";
export const SITE_NAME = "Codefloor IT";
const OG_IMAGE = `${SITE_URL}/og.png`;

/* During prerendering the server provides a sink object; the page's SEO config
   is written to it so scripts/prerender.mjs can emit real <head> tags. */
export const SeoSink = createContext(null);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function resolve({ title, description, path = "/", type = "website", jsonLd, noindex }) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  return { fullTitle, description, url: `${SITE_URL}${path}`, type, blocks, noindex };
}

/** Head markup for one page — used by the prerender script. */
export function headHtml(cfg) {
  const s = resolve(cfg);
  return [
    `<title>${esc(s.fullTitle)}</title>`,
    `<meta name="description" content="${esc(s.description)}" />`,
    s.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${s.url}" />`,
    `<meta property="og:type" content="${s.type}" />`,
    `<meta property="og:title" content="${esc(s.fullTitle)}" />`,
    `<meta property="og:description" content="${esc(s.description)}" />`,
    `<meta property="og:url" content="${s.url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:title" content="${esc(s.fullTitle)}" />`,
    `<meta name="twitter:description" content="${esc(s.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...s.blocks.map((b) => `<script type="application/ld+json" data-seo="1">${JSON.stringify(b).replace(/</g, "\\u003c")}</script>`),
  ].join("\n    ");
}

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/** Sets title, description, canonical, Open Graph / Twitter tags and JSON-LD for the current page. */
export function useSeo(cfg) {
  const sink = useContext(SeoSink);
  // oxlint-disable-next-line react/immutability -- deliberate: the sink is a prerender-only collector
  if (sink) sink.current = cfg;
  const key = JSON.stringify(cfg);

  useEffect(() => {
    const s = resolve(JSON.parse(key));
    document.title = s.fullTitle;
    setMeta("name", "description", s.description);
    setMeta("property", "og:type", s.type);
    setMeta("property", "og:title", s.fullTitle);
    setMeta("property", "og:description", s.description);
    setMeta("property", "og:url", s.url);
    setMeta("name", "twitter:title", s.fullTitle);
    setMeta("name", "twitter:description", s.description);
    document.head.querySelector('link[rel="canonical"]')?.setAttribute("href", s.url);

    document.head.querySelectorAll('script[data-seo="1"]').forEach((n) => n.remove());
    s.blocks.forEach((block) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.dataset.seo = "1";
      el.text = JSON.stringify(block);
      document.head.appendChild(el);
    });
  }, [key]);
}

/* ---------- Structured-data builders ---------- */

export const crumbs = (...items) => [{ name: "Home", path: "/" }, ...items];

export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    provider: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}${path}`,
  };
}

export function articleLd({ title, description, path, date }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}${path}`,
  };
}

export function creativeWorkLd({ title, description, path, category }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    about: category,
    description,
    creator: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}${path}`,
  };
}
