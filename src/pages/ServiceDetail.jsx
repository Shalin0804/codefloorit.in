import { useParams } from "react-router";
import { Check } from "lucide-react";
import { useSeo, breadcrumbLd, crumbs, faqLd, serviceLd } from "../lib/seo";
import { getService, services } from "../data/services";
import { projects } from "../data/projects";
import { ArrowLink, Btn, CtaBand, FaqList, PageHero, Reveal, SectionHeading } from "../components/ui";
import { ProjectCard } from "../components/cards";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = getService(slug);
  return s ? <Detail s={s} /> : <NotFound />;
}

function Detail({ s }) {
  const path = `/services/${s.slug}`;
  const trail = crumbs({ name: "Services", path: "/services" }, { name: s.title, path });
  const related = projects.filter((p) => s.projects.includes(p.slug));
  const Icon = s.icon;

  useSeo({
    title: s.seoTitle,
    description: `${s.title} by Codefloor IT. ${s.short}`,
    path,
    jsonLd: [breadcrumbLd(trail), serviceLd({ name: s.title, description: s.short, path }), faqLd(s.faqs)],
  });

  return (
    <>
      <PageHero crumbs={trail} scene="laptop" eyebrow="Service" title={s.title} sub={s.short}>
        <div className="actions">
          <Btn to={`/contact?service=${s.slug}`} magnetic arrow>Discuss your project</Btn>
        </div>
      </PageHero>

      <section className="section">
        <div className="container split">
          <Reveal>
            <span className="icon-tile icon-tile--lg"><Icon size={30} aria-hidden="true" /></span>
            <p className="lead">{s.intro}</p>
          </Reveal>
          <Reveal delay={100} className="card spot panel">
            <h2>What we build</h2>
            <ul className="checks">
              {s.build.map((b) => (
                <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <SectionHeading eyebrow="Approach" title="How we handle it" />
          <div className="grid grid--3">
            {s.approach.map((a, i) => (
              <Reveal key={a.h} delay={i * 90} className="card spot panel">
                <span className="plist__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{a.h}</h3>
                <p>{a.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Related work" title="Projects involving this kind of work" />
            <div className="grid grid--3">
              {related.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${related.length ? "tint" : ""}`}>
        <div className="container container--narrow">
          <SectionHeading center eyebrow="FAQ" title={`${s.title}: common questions`} />
          <FaqList faqs={s.faqs} />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <h2 className="h-small">Other services</h2>
          <ul className="linkrow">
            {services.filter((o) => o.slug !== s.slug).map((o) => (
              <li key={o.slug}><ArrowLink to={`/services/${o.slug}`}>{o.title}</ArrowLink></li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
