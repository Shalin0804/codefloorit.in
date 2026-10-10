import { useSeo, breadcrumbLd, crumbs } from "../lib/seo";
import { projects } from "../data/projects";
import { CtaBand, PageHero } from "../components/ui";
import { ProjectCard } from "../components/cards";

const trail = crumbs({ name: "Our Work", path: "/work" });

export default function Work() {
  useSeo({
    title: "Selected Work & Digital Experiences",
    description:
      "Projects by Codefloor IT across legal, hospitality and healthcare — with honest labels for what is completed and what is still in development.",
    path: "/work",
    jsonLd: breadcrumbLd(trail),
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        scene="windows"
        eyebrow="Our work"
        title="Selected Work & Digital Experiences"
        sub="Real projects, described as they are — including what is still in development."
      />
      <section className="section tint">
        <div className="container">
          <div className="grid grid--3">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
          <p className="notice notice--plain">
            The visuals above are illustrative layout mockups, not screenshots of the delivered products.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
