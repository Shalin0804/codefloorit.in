import { Check, Mail, MessageCircle, Phone } from "lucide-react";
import { CONTACT, PROCESS, WHY, whatsappLink } from "../data/site";
import { techGroups } from "../data/tech";
import { useScrollProgress } from "../lib/motion";
import { Ambient, Reveal, SectionHeading } from "./ui";
import ContactForm from "./ContactForm";
import { ZoomIn } from "./scenes";
import Scene3D from "./Scene3D";

export function TechShowcase() {
  return (
    <section className="section tech" data-robot="think" data-morph>
      <Ambient />
      <ZoomIn className="container">
        <div className="tech__head">
          <SectionHeading
            eyebrow="Technology"
            title="Modern Technology. Thoughtful Engineering."
            sub="Well-supported tools we work with, chosen to fit each project. Not every technology is used on every build."
          />
          <div className="tech__3d"><Scene3D kind="laptop" /></div>
        </div>
        <div className="tech__grid">
          <span className="tech__wire" aria-hidden="true" />
          {techGroups.map((g, i) => (
            <Reveal key={g.label} delay={i * 100} className="tech__card spot">
              <span className="tech__node" aria-hidden="true" />
              <h3>{g.label}</h3>
              <p>{g.note}</p>
              <ul className="tags">
                {g.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </ZoomIn>
    </section>
  );
}

export function ProcessTimeline() {
  const ref = useScrollProgress("fill");
  return (
    <div className="tl" ref={ref}>
      <span className="tl__line" aria-hidden="true"><i /></span>
      <ol>
        {PROCESS.map((s) => (
          <Reveal as="li" key={s.n} className="tl__step">
            <span className="tl__dot" aria-hidden="true" />
            <div className="tl__card">
              <span className="tl__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export function ProcessSection() {
  return (
    <section className="section dark" data-robot="think" data-robot-hint="process">
      <div className="gridbg" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          center
          eyebrow="Our process"
          title="From first conversation to continuous improvement"
          sub="Six clear stages, so you always know where the project stands and what comes next."
        />
        <ProcessTimeline />
      </div>
    </section>
  );
}

/** Abstract hexagonal lattice that drifts with scroll. */
function Lattice() {
  const ref = useScrollProgress();
  const cells = [
    [70, 60], [150, 106], [230, 60], [70, 152], [230, 152], [150, 198], [70, 244], [230, 244], [150, 290],
  ];
  return (
    <svg ref={ref} className="lattice" viewBox="0 0 300 350" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lat-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00D4FF" />
          <stop offset="1" stopColor="#1677FF" />
        </linearGradient>
      </defs>
      <g className="lattice__back">
        {cells.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y - 46} l40 23 v46 l-40 23 l-40 -23 v-46 z`} stroke="#00D4FF" strokeOpacity=".28" />
        ))}
      </g>
      <g className="lattice__front">
        <path d="M150 60 l40 23 v46 l-40 23 l-40 -23 v-46 z" fill="url(#lat-g)" fillOpacity=".16" stroke="url(#lat-g)" strokeWidth="1.5" />
        <path d="M230 106 l40 23 v46 l-40 23 l-40 -23 v-46 z" fill="url(#lat-g)" fillOpacity=".08" stroke="url(#lat-g)" />
        <path d="M70 198 l40 23 v46 l-40 23 l-40 -23 v-46 z" fill="url(#lat-g)" fillOpacity=".1" stroke="url(#lat-g)" />
        <circle cx="150" cy="106" r="5" fill="#00D4FF" />
        <circle cx="230" cy="152" r="4" fill="#1677FF" />
        <circle cx="70" cy="244" r="4" fill="#1677FF" />
        <path d="M150 106 L230 152 M150 106 L70 244" stroke="url(#lat-g)" strokeDasharray="3 6" />
      </g>
    </svg>
  );
}

export function WhySection() {
  return (
    <section className="section tint" data-robot="idle">
      <Ambient />
      <div className="container why">
        <div className="why__lead">
          <SectionHeading
            eyebrow="Why Codefloor IT"
            title="An approach built around how you work"
            sub="No headline statistics or borrowed logos. This is how we run every project."
          />
          <Lattice />
        </div>
        <ul className="why__list">
          {WHY.map((w, i) => (
            <Reveal as="li" key={w.title} delay={i * 70} from="right">
              <span className="why__check"><Check size={18} aria-hidden="true" /></span>
              <div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Contact details + form. `heading` is passed on pages where this is not under an <h1>. */
export function ContactSection({ heading = true }) {
  return (
    <section className={`section dark contact ${heading ? "" : "contact--page"}`} id="contact" data-morph data-robot="greet" data-robot-hint={heading ? "contact" : undefined}>
      <div className="gridbg" aria-hidden="true" />
      <ZoomIn className="container contact__grid">
        <div>
          {heading && (
            <SectionHeading
              eyebrow="Contact"
              title="Have an Idea? Let's Build It."
              sub="Tell us about your project, business challenge, or technology requirements. Let's explore the right solution."
            />
          )}
          <Reveal className="contact__ways" from="left">
            <a href={whatsappLink("Hello Codefloor IT, I would like to discuss a project.")} className="way way--wa" target="_blank" rel="noopener noreferrer">
              <span className="icon-tile"><MessageCircle size={22} aria-hidden="true" /></span>
              <span><small>Chat on WhatsApp</small>{CONTACT.phoneDisplay}<span className="sr-only"> (opens in a new tab)</span></span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="way">
              <span className="icon-tile"><Mail size={22} aria-hidden="true" /></span>
              <span><small>Email us</small>{CONTACT.email}</span>
            </a>
            <a href={CONTACT.phoneHref} className="way">
              <span className="icon-tile"><Phone size={22} aria-hidden="true" /></span>
              <span><small>Call us</small>{CONTACT.phoneDisplay}</span>
            </a>
          </Reveal>
        </div>
        <Reveal delay={120} from="right">
          <ContactForm />
        </Reveal>
      </ZoomIn>
    </section>
  );
}
