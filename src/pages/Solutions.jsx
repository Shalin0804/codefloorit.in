import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useSeo, breadcrumbLd, crumbs } from "../lib/seo";
import { solutions } from "../data/solutions";
import { getService } from "../data/services";
import { getProject } from "../data/projects";
import { ArrowLink, CtaBand, PageHero, Reveal } from "../components/ui";
import { SolutionArt } from "../components/cards";

const trail = crumbs({ name: "Solutions", path: "/solutions" });

/** Which solution panel is currently in the middle of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const IDS = solutions.map((s) => s.slug);

export default function Solutions() {
  const active = useActiveSection(IDS);
  const activeIndex = IDS.indexOf(active);

  useSeo({
    title: "Digital Solutions for Real-World Challenges",
    description:
      "The kinds of software Codefloor IT can design and build for hospitality, logistics, healthcare, business operations, e-commerce and customer support.",
    path: "/solutions",
    pageType: "CollectionPage",
    jsonLd: breadcrumbLd(trail),
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        scene="hexes"
        eyebrow="Solutions"
        title="Digital Solutions for Real-World Challenges"
        sub="Common business problems and the kind of software that can be built to solve them."
      />

      <section className="section">
        <div className="container">
          <p className="notice">
            These are solution categories describing what we can build. They are not a list of
            clients or completed projects — real work is shown on the <ArrowLink to="/work">Our Work</ArrowLink> page.
          </p>

          <div className="solx">
            {/* index rail: follows the reader and marks the category in view */}
            <nav className="solx__nav" aria-label="Solution categories" style={{ "--at": activeIndex }}>
              <span className="solx__marker" aria-hidden="true" />
              <ol>
                {solutions.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.slug}>
                      <a href={`#${s.slug}`} className={s.slug === active ? "is-active" : ""} aria-current={s.slug === active ? "true" : undefined}>
                        <span className="solx__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                        <Icon size={18} aria-hidden="true" />
                        {s.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="solx__panels">
              {solutions.map((s, i) => {
                const project = s.project && getProject(s.project);
                return (
                  <Reveal as="article" key={s.slug} id={s.slug} className="solp" data-active={s.slug === active ? "" : undefined} from="scale">
                    <span className="solp__ghost" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <SolutionArt solution={s} />
                    <div className="solp__body">
                      <h2>{s.title}</h2>
                      <p className="solrow__challenge"><strong>The challenge:</strong> {s.challenge}</p>
                      <h3 className="h-small">What we can build</h3>
                      <ul className="checks checks--2">
                        {s.canBuild.map((b) => (
                          <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
                        ))}
                      </ul>
                      {s.note && <p className="solrow__note">{s.note}</p>}
                      <ul className="linkrow">
                        {s.services.map((slug) => (
                          <li key={slug}><ArrowLink to={`/services/${slug}`}>{getService(slug).title}</ArrowLink></li>
                        ))}
                        {project && (
                          <li>
                            <ArrowLink to={`/work/${project.slug}`}>
                              Related project: {project.title} ({project.status})
                            </ArrowLink>
                          </li>
                        )}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Have a different challenge?" sub="Most projects start with a business problem, not a category. Tell us what you are trying to solve." />
    </>
  );
}
