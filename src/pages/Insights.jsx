import { useState } from "react";
import { Link } from "react-router";
import { Clock } from "lucide-react";
import { useSeo, breadcrumbLd, crumbs } from "../lib/seo";
import { articles, CATEGORIES } from "../data/insights";
import { CtaBand, PageHero, Reveal } from "../components/ui";

const trail = crumbs({ name: "Insights", path: "/insights" });
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-02-10" -> "10 Feb 2026" without locale-dependent formatting. */
export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function ArticleCard({ article, index = 0 }) {
  return (
    <Reveal as="article" delay={(index % 3) * 90} className="card spot acard">
      <p className="acard__cat">{article.categoryLabel}</p>
      <h3>
        <Link to={`/insights/${article.slug}`} className="stretched">{article.title}</Link>
      </h3>
      <p>{article.description}</p>
      <p className="acard__meta">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span><Clock size={14} aria-hidden="true" /> {article.readMins} min read</span>
      </p>
    </Reveal>
  );
}

export default function Insights() {
  const [cat, setCat] = useState("all");
  const shown = cat === "all" ? articles : articles.filter((a) => a.category === cat);

  useSeo({
    title: "Insights — Practical Guides on Websites & Business Software",
    description:
      "Plain-language guides from Codefloor IT on business websites, custom software, hotel booking systems and patient management software.",
    path: "/insights",
    jsonLd: breadcrumbLd(trail),
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        scene="rings"
        eyebrow="Insights"
        title="Practical answers before you start a project"
        sub="Plain-language guides to the questions businesses ask us about websites and software."
      />
      <section className="section tint">
        <div className="container">
          <fieldset className="filters">
            <legend className="sr-only">Filter articles by topic</legend>
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </fieldset>
          <div className="grid grid--3">
            {shown.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
