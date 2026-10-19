import { useSeo, breadcrumbLd, crumbs } from "../lib/seo";
import { PRINCIPLES } from "../data/site";
import { CtaBand, PageHero, Reveal, SectionHeading } from "../components/ui";
import { ProcessSection, WhySection } from "../components/sections";

const trail = crumbs({ name: "About Us", path: "/about" });

export default function About() {
  useSeo({
    title: "About Codefloor IT — Built on Engineering",
    description:
      "Codefloor IT is a technology-focused development company in Ahmedabad, Gujarat. We understand business requirements first, then build practical, maintainable software.",
    path: "/about",
    pageType: "AboutPage",
    jsonLd: breadcrumbLd(trail),
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        eyebrow="About us"
        title="Built on Engineering. Driven by Possibility."
        sub="Codefloor IT is a technology-focused development company that turns business requirements into practical, well-built digital products."
      />

      <section className="section">
        <div className="container split split--top">
          <SectionHeading eyebrow="What we believe" title="Software should fit the business, not the other way around" />
          <Reveal delay={100} className="prose">
            <p>
              Businesses often end up bending their work around generic software, or commissioning
              something that looks impressive on launch day and is painful to change afterwards. We
              try to avoid both.
            </p>
            <p>
              Our work starts with understanding the requirement: who will use the product, what they
              need to get done, and how the business runs today. From there we design clear
              interfaces, build maintainable software, and keep you informed at every stage.
            </p>
            <p>
              We would rather describe our work accurately than oversell it. You will not find
              invented statistics or borrowed client logos on this site — only what we do and how
              we do it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <SectionHeading eyebrow="Principles" title="What guides every project" />
          <div className="grid grid--3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 90} className="card spot panel">
                <span className="plist__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
      <WhySection />
      <CtaBand />
    </>
  );
}
