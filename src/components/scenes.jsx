import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/projects";
import { useScrollProgress } from "../lib/motion";
import { ArrowLink, StatusBadge } from "./ui";
import { Mockup } from "./cards";

/* Scroll storytelling primitives. Pinning is plain `position: sticky` inside a tall
   wrapper; the shared scroll loop in lib/motion.js writes the wrapper's progress to
   --p and the stylesheet turns that into zoom, depth and fades. On phones and with
   reduced motion the wrappers collapse to normal flow (see "Scenes" in index.css). */

/** Content scales and fades up to full size as it enters the viewport. */
export function ZoomIn({ className = "", children }) {
  const ref = useScrollProgress("enter");
  return (
    <div ref={ref} className={`zoom ${className}`}>
      {children}
    </div>
  );
}

/** Pinned portfolio: one project at a time, each zooming past the camera into the next. */
export function WorkScene() {
  const n = projects.length;
  const [active, setActive] = useState(0);
  const ref = useScrollProgress("pin", (p) => setActive(Math.round(p * (n - 1))));

  return (
    <section className="scene scene--work" ref={ref} style={{ "--n": n }} data-robot="explore" data-robot-hint="work">
      <div className="scene__pin">
        <div className="container">
          <header className="wscene__head">
            <div>
              <p className="eyebrow">Our work</p>
              <h2 className="shead__title">Selected Work &amp; Digital Experiences</h2>
            </div>
            <div className="wscene__nav">
              <p className="wscene__count" aria-hidden="true">
                <b>{String(active + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
              </p>
              <ArrowLink to="/work">All work</ArrowLink>
            </div>
          </header>

          <div className="wstage">
            {projects.map((p, i) => (
              <article key={p.slug} className={`wpanel pcard--${p.scene} ${i === active ? "is-active" : ""}`} style={{ "--i": i }}>
                <div className="wpanel__media">
                  <Mockup scene={p.scene} />
                  <span className="pcard__tag">Illustrative mockup</span>
                </div>
                <div className="wpanel__body">
                  <div className="pcard__meta">
                    <span>{p.category}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <ul className="tags" aria-label="Technology">
                    {p.tech.slice(0, 4).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <Link to={`/work/${p.slug}`} className="btn btn--outline">
                    View case study<span className="sr-only">: {p.title}</span>
                    <ArrowUpRight size={18} className="btn__arrow" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="wpips" aria-hidden="true">
            {projects.map((p, i) => (
              <i key={p.slug} className={i === active ? "is-active" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
