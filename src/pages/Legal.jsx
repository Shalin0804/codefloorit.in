import { useSeo, breadcrumbLd, crumbs } from "../lib/seo";
import { CONTACT } from "../data/site";
import { PageHero } from "../components/ui";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    path: "/privacy-policy",
    desc: "How Codefloor IT handles information submitted through this website.",
    blocks: [
      ["Overview", "This policy explains what information Codefloor IT collects through this website and how it is used. It applies only to codefloorit.in."],
      ["Information we collect", "We collect the information you choose to send us through the contact form, by email or by phone — typically your name, company, email address, phone number and a description of your project. Like most websites, the servers that deliver this site may record standard technical request data such as IP address and browser type."],
      ["How we use it", "We use the information you submit solely to respond to your enquiry, discuss your project and provide the services you request. We do not sell your information or share it with third parties for marketing."],
      ["Data retention", "Enquiry information is kept for as long as needed to respond and, where a project proceeds, for the duration of our working relationship and a reasonable period afterwards for record-keeping."],
      ["Your choices", `You can ask what information we hold about you, ask us to correct it, or ask us to delete it, by emailing ${CONTACT.email}.`],
      ["Changes", "We may update this policy from time to time. The latest version will always be available on this page."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    path: "/terms",
    desc: "The terms that apply to your use of the Codefloor IT website.",
    blocks: [
      ["Use of this website", "This website is provided for general information about Codefloor IT and its services. You may view and share its content for personal, non-commercial reference."],
      ["No warranty", "The content on this website is provided in good faith and for general information. Project examples describe work at the time of writing; features and status may change. Nothing on this site is a binding offer or a guarantee of a specific outcome, price or timeline."],
      ["Project work", "Any engagement to design or develop software is governed by a separate written agreement between you and Codefloor IT. That agreement, not this website, defines scope, deliverables, cost and ownership."],
      ["Intellectual property", "The design, text and graphics on this website are owned by Codefloor IT unless stated otherwise. Product and technology names mentioned belong to their respective owners."],
      ["Contact", `Questions about these terms can be sent to ${CONTACT.email}.`],
    ],
  },
};

export default function Legal({ kind }) {
  const c = CONTENT[kind];
  const trail = crumbs({ name: c.title, path: c.path });
  useSeo({ title: c.title, description: c.desc, path: c.path, jsonLd: breadcrumbLd(trail) });

  return (
    <>
      <PageHero crumbs={trail} title={c.title} sub={c.desc} />
      <section className="section">
        <div className="container container--narrow prose">
          {c.blocks.map(([h, p]) => (
            <div key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </div>
          ))}
          <p className="prose__meta">Last updated: October 2026.</p>
        </div>
      </section>
    </>
  );
}
