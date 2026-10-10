import { useParams } from "react-router";
import { Check } from "lucide-react";
import { useSeo, breadcrumbLd, creativeWorkLd, crumbs } from "../lib/seo";
import { getProject } from "../data/projects";
import { getArticle } from "../data/insights";
import { ArrowLink, CtaBand, PageHero, Reveal, StatusBadge } from "../components/ui";
import { Mockup } from "../components/cards";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = getProject(slug);
  return p ? <Detail p={p} /> : <NotFound />;
}

function Detail({ p }) {
  const path = `/work/${p.slug}`;
  const trail = crumbs({ name: "Our Work", path: "/work" }, { name: p.title, path });

  useSeo({
    title: p.seoTitle,
    description: p.seoDescription,
    path,
    jsonLd: [breadcrumbLd(trail), creativeWorkLd({ title: p.title, description: p.description, path, category: p.category })],
  });

  return (
    <>
      <PageHero crumbs={trail} scene="windows" eyebrow={p.category} title={p.title} sub={p.summary}>
        <StatusBadge status={p.status} />
      </PageHero>

      <section className="section">
        <div className="container split split--top">
          <Reveal className="prose">
            <h2>Overview</h2>
            <p>{p.overview}</p>
            <h2>The challenge</h2>
            <p>{p.challenge}</p>
            <h2>Our approach</h2>
            {p.approach.map((a) => (
              <p key={a}>{a}</p>
            ))}
            <h2>The solution</h2>
            <p>{p.solution}</p>
            <p>{p.ux}</p>
            <h2>{p.status === "Completed" ? "Outcome" : "Current status"}</h2>
            <p>{p.outcome}</p>
          </Reveal>

          <aside className="pside">
            <Reveal className="pside__mock">
              <Mockup scene={p.scene} />
              <p>Illustrative mockup — not a product screenshot.</p>
            </Reveal>
            <Reveal delay={80} className="card spot panel">
              <h2 className="h-small">Technology</h2>
              <ul className="tags">
                {p.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            {p.relatedInsights?.length > 0 && (
              <Reveal delay={140} className="card spot panel">
                <h2 className="h-small">Related reading</h2>
                <ul className="linkcol">
                  {p.relatedInsights.map((s) => (
                    <li key={s}><ArrowLink to={`/insights/${s}`}>{getArticle(s).title}</ArrowLink></li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <h2 className="shead__title">Features</h2>
          <div className="grid grid--3 grid--top">
            {p.featureGroups.map((g, i) => (
              <Reveal key={g.h} delay={(i % 3) * 90} className="card spot panel">
                <h3>{g.h}</h3>
                <ul className="checks">
                  {g.items.map((it) => (
                    <li key={it}><Check size={16} aria-hidden="true" /> {it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Planning something similar?" sub="Tell us about your requirements and we will give you an honest read on scope and approach." />
    </>
  );
}
