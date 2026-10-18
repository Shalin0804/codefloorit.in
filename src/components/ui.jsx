import { Link } from "react-router";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import { useReveal, useMagnetic, usePointerVars, useScrollProgress } from "../lib/motion";
import Scene3D from "./Scene3D";

/** Fades and slides its content in the first time it enters the viewport.
    Keep className stable: the revealed state is a class added outside React. */
export function Reveal({ as: Tag = "div", delay = 0, from, className = "", children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} data-from={from} style={delay ? { "--d": `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}

/** Link or button styled as a button. `to` = internal route, `href` = external/mailto/tel. */
export function Btn({ to, href, variant = "primary", magnetic = false, arrow = false, className = "", children, ...rest }) {
  const ref = useMagnetic(magnetic ? 0.22 : 0);
  const cls = `btn btn--${variant} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />}
    </>
  );
  if (to) return <Link ref={ref} to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a ref={ref} href={href} className={cls} {...rest}>{inner}</a>;
  return <button ref={ref} className={cls} {...rest}>{inner}</button>;
}

/** Inline text link with an animated arrow. */
export function ArrowLink({ to, children, className = "" }) {
  return (
    <Link to={to} className={`alink ${className}`}>
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

/** Wraps each word so headings can animate in word by word (see .sw in the stylesheet). */
export function Split({ text }) {
  if (typeof text !== "string") return text;
  return text.split(" ").map((word, i) => (
    <span key={i}>
      <span className="sw" style={{ "--w": i }}><span>{word}</span></span>{" "}
    </span>
  ));
}

/** Endless horizontal ticker. Decorative: the same items exist as real links elsewhere. */
export function Marquee({ items, reverse = false }) {
  const set = items.map((t) => (
    <span key={t}>{t}<i /></span>
  ));
  return (
    <div className={`mq ${reverse ? "mq--rev" : ""}`} aria-hidden="true">
      <div className="mq__track">
        <div>{set}</div>
        <div>{set}</div>
      </div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, sub, center = false, as: H = "h2" }) {
  return (
    <Reveal className={`shead ${center ? "shead--center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H className="shead__title"><Split text={title} /></H>
      <span className="shead__line" aria-hidden="true" />
      {sub && <p className="shead__sub">{sub}</p>}
    </Reveal>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.map((it, i) => (
          <li key={it.path}>
            {i < items.length - 1 ? (
              <>
                <Link to={it.path}>{it.name}</Link>
                <ChevronRight size={14} aria-hidden="true" />
              </>
            ) : (
              <span aria-current="page">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Dark header band used at the top of every interior page. */
export function PageHero({ crumbs, eyebrow, title, sub, scene = "cluster", children }) {
  const pointer = usePointerVars();
  return (
    <section className="phero" data-robot="idle" ref={pointer}>
      <div className="aurora" aria-hidden="true"><i /><i /></div>
      <div className="gridbg" aria-hidden="true" />
      <div className="pglow" aria-hidden="true" />
      <Scene3D kind={scene} />
      <div className="container phero__in">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="phero__title"><Split text={title} /></h1>
        {sub && <p className="phero__sub">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

export function FaqList({ faqs }) {
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <Reveal as="details" key={f.q} delay={i * 60} className="faq__item">
          <summary>
            <span>{f.q}</span>
            <Plus size={20} aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** Soft gradient orbs behind a section; they drift slightly with scroll position. */
export function Ambient() {
  const ref = useScrollProgress();
  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      <i /><i />
    </div>
  );
}

export function CtaBand({ title = "Have an idea? Let's build it.", sub = "Tell us about your project, business challenge or technology requirements." }) {
  const pointer = usePointerVars();
  return (
    <section className="cta dark" ref={pointer}>
      <div className="gridbg" aria-hidden="true" />
      <div className="pglow" aria-hidden="true" />
      <div className="streak" aria-hidden="true" />
      <Reveal className="container cta__in">
        <h2>{title}</h2>
        <p>{sub}</p>
        <div className="actions actions--center">
          <Btn to="/contact" magnetic arrow>Let's Build Something</Btn>
          <Btn to="/work" variant="ghost">Explore Our Work</Btn>
        </div>
      </Reveal>
    </section>
  );
}

/** `sizes` is the rendered width: 46px tall (40px on phones) in the header, 64px in the footer. */
export function Logo({ className = "", sizes = "(max-width: 640px) 89px, 103px", loading }) {
  return (
    <img
      src="/logo.webp"
      srcSet="/logo-160.webp 160w, /logo.webp 384w"
      sizes={sizes}
      width="384"
      height="172"
      alt="Codefloor IT"
      className={`logo ${className}`}
      loading={loading}
      decoding="async"
    />
  );
}

export function StatusBadge({ status }) {
  return <span className={`status status--${status === "Completed" ? "done" : "wip"}`}>{status}</span>;
}
