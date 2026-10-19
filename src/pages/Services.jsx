import { Check } from "lucide-react";
import { useSeo, breadcrumbLd, crumbs, SITE_URL } from "../lib/seo";
import { services } from "../data/services";
import { ArrowLink, CtaBand, PageHero, Reveal } from "../components/ui";
import { ProcessSection } from "../components/sections";

const trail = crumbs({ name: "Services", path: "/services" });

export default function Services() {
  useSeo({
    title: "Software & Web Development Services",
    description:
      "Custom software, web applications, business websites, e-commerce, website modernization and ongoing technical support from Codefloor IT.",
    path: "/services",
    pageType: "CollectionPage",
    jsonLd: [
      breadcrumbLd(trail),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: services.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          url: `${SITE_URL}/services/${s.slug}`,
        })),
      },
    ],
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        scene="laptop"
        eyebrow="Services"
        title="Technology Built Around Your Ambition"
        sub="Practical engineering and thoughtful design for businesses building their next stage of digital growth."
      />

      <section className="section">
        <div className="container srows">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="article" key={s.slug} className="srow" id={s.slug} from={i % 2 ? "right" : "left"}>
                <div className="srow__head">
                  <span className="srow__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="icon-tile"><Icon size={24} aria-hidden="true" /></span>
                </div>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.intro}</p>
                  <ArrowLink to={`/services/${s.slug}`}>
                    Explore<span className="sr-only"> {s.title}</span>
                  </ArrowLink>
                </div>
                <ul className="checks">
                  {s.build.slice(0, 4).map((b) => (
                    <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ProcessSection />
      <CtaBand />
    </>
  );
}
