import { ChevronDown } from "lucide-react";
import { useSeo, faqLd } from "../lib/seo";
import { usePointerVars, useScrollProgress } from "../lib/motion";
import { services } from "../data/services";
import { solutions } from "../data/solutions";
import { techGroups } from "../data/tech";
import { HOME_FAQ, PRINCIPLES } from "../data/site";
import { ArrowLink, Btn, FaqList, Marquee, Reveal, SectionHeading } from "../components/ui";
import { ServiceCard, SolutionCard } from "../components/cards";
import { ContactSection, ProcessSection, TechShowcase, WhySection } from "../components/sections";
import { WorkScene, ZoomIn } from "../components/scenes";
import HeroVisual from "../components/HeroVisual";
import Scene3D from "../components/Scene3D";

/* Pinned opening scene: the wrapper is taller than the viewport, the hero sticks,
   and scroll progress (--p) zooms the camera into the robot while the copy lifts away. */
function Hero() {
  const pointer = usePointerVars();
  const scene = useScrollProgress("pin");
  return (
    <div className="scene scene--hero" ref={scene} data-robot="idle" data-morph>
      <section className="hero" ref={pointer}>
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="gridbg gridbg--drift" aria-hidden="true" />
        <div className="pglow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow hero__in" style={{ "--i": 0 }}>Web &amp; software development · Ahmedabad</p>
            <h1 className="hero__title hero__in" style={{ "--i": 1 }}>
              Websites &amp; Software That <span className="grad">Grow Your Business.</span>
            </h1>
            <p className="hero__sub hero__in" style={{ "--i": 2 }}>
              From a business website that brings in enquiries to custom software that runs your
              operations, we plan, design, build and support it with you, for businesses across India.
            </p>
            <div className="actions hero__in" style={{ "--i": 3 }}>
              <Btn to="/contact" magnetic arrow>Discuss Your Project</Btn>
              <Btn to="/work" variant="outline">See Our Work</Btn>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__in" style={{ "--i": 2 }}>
              <HeroVisual />
            </div>
          </div>
        </div>
        <a href="#services" className="hero__scroll" aria-label="Scroll to services">
          <ChevronDown size={20} aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

export default function Home() {
  useSeo({
    title: "Codefloor IT — Web & Software Development Company in Ahmedabad",
    description:
      "Codefloor IT is a web and software development company in Ahmedabad, Gujarat, building business websites, web applications, e-commerce stores and custom software.",
    path: "/",
    jsonLd: faqLd(HOME_FAQ),
  });

  return (
    <>
      <Scene3D kind="morph" />
      <Hero />
      <Marquee reverse items={techGroups.flatMap((g) => g.items)} />

      <section className="section tint" id="services" data-robot="point" data-morph data-robot-hint="services">
        <ZoomIn className="container">
          <div className="shead-row">
            <SectionHeading
              eyebrow="Services"
              title="Technology Built Around Your Ambition"
              sub="Practical engineering and thoughtful design for businesses building their next stage of digital growth."
            />
            <ArrowLink to="/services">All services</ArrowLink>
          </div>
          <div className="sgrid">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </ZoomIn>
      </section>

      <section className="section" data-robot="point" data-morph>
        <div className="container">
          <div className="shead-row">
            <SectionHeading
              eyebrow="Solutions"
              title="Digital Solutions for Real-World Challenges"
              sub="Use cases we can design and build software for. These are solution areas, not a client list."
            />
            <ArrowLink to="/solutions">All solutions</ArrowLink>
          </div>
          <div className="grid grid--3">
            {solutions.map((s, i) => (
              <SolutionCard key={s.slug} solution={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <WorkScene />
      <TechShowcase />

      <section className="section about-teaser" data-robot="idle">
        <div className="container split">
          <div>
            <SectionHeading
              eyebrow="About us"
              title="Built on Engineering. Driven by Possibility."
              sub="Codefloor IT is a technology-focused development company. We take time to understand what a business needs, then build practical, maintainable software around it."
            />
            <Reveal delay={100}>
              <Btn to="/about" variant="outline" arrow>More about us</Btn>
            </Reveal>
          </div>
          <ul className="plist">
            {PRINCIPLES.slice(0, 4).map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80} from="right">
                <span className="plist__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ProcessSection />
      <WhySection />

      <section className="section" data-robot="idle">
        <div className="container container--narrow">
          <SectionHeading center eyebrow="FAQ" title="Questions we hear most" />
          <FaqList faqs={HOME_FAQ} />
        </div>
      </section>

      <ContactSection />
    </>
  );
}
