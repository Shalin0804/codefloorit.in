import { useSeo, breadcrumbLd, crumbs } from "../lib/seo";
import { PageHero } from "../components/ui";
import { ContactSection } from "../components/sections";

const trail = crumbs({ name: "Contact", path: "/contact" });

export default function Contact() {
  useSeo({
    title: "Contact Codefloor IT — Let's Build Your Idea",
    description:
      "Tell Codefloor IT about your project, business challenge or technology requirements. Email info@codefloorit.com or call +91 76984 75791.",
    path: "/contact",
    jsonLd: breadcrumbLd(trail),
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        scene="rings"
        eyebrow="Contact"
        title="Have an Idea? Let's Build It."
        sub="Tell us about your project, business challenge, or technology requirements. Let's explore the right solution."
      />
      <ContactSection heading={false} />
    </>
  );
}
