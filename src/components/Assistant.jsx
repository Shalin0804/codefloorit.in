import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { X } from "lucide-react";
import { CONTACT } from "../data/site";
import { HINTS } from "../data/sukaram";
import Robot from "./Robot";

const AssistantPanel = lazy(() => import("./AssistantPanel"));

/** Shown if the panel's code fails to load (offline, blocked chunk). */
class PanelBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="asst__panel asst__panel--note" role="alert">
        Sukaram could not be loaded. You can still reach us at{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </div>
    );
  }
}

/* Sukaram, the persistent robot button. His pose follows the section in view (sections
   opt in with data-robot="point|explore|think|greet|idle") and the conversation while
   the panel is open. The first-visit introduction is the hero robot's job
   (HeroVisual.jsx); here he may offer one short tip per section (data-robot-hint="<key in HINTS>"). */
export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState(null);
  const [hint, setHint] = useState(null);
  const [mood, setMood] = useState("idle");
  const [act, setAct] = useState(null); // pose driven by the conversation; overrides the section pose
  const { pathname } = useLocation();
  const fab = useRef(null);
  const hinted = useRef(new Set());
  const hintsOff = useRef(false);
  const bye = useRef(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        setMood(hit.target.dataset.robot);
        // each tip is offered once; leaving its section takes it away again
        const key = hit.target.dataset.robotHint;
        const fresh = key && !hintsOff.current && !hinted.current.has(key);
        if (fresh) hinted.current.add(key);
        setHint(fresh ? key : null);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    document.querySelectorAll("[data-robot]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 8000);
    return () => clearTimeout(t);
  }, [hint]);

  useEffect(() => () => clearTimeout(bye.current), []);

  function openPanel(question = null) {
    clearTimeout(bye.current);
    setHint(null);
    setAsk(question);
    setAct(null);
    setOpen(true);
  }

  const close = useCallback(() => {
    fab.current?.focus(); // first: the panel's input reports its blur as a pose change
    setOpen(false);
    setAct("farewell");
    clearTimeout(bye.current);
    bye.current = setTimeout(() => setAct(null), 1800);
  }, []);

  const pose = act ?? (open ? "greet" : hint ? "point" : mood);

  return (
    <div className="asst">
      {open && (
        <PanelBoundary>
          <Suspense fallback={<output className="asst__panel asst__panel--note">Waking Sukaram up…</output>}>
            <AssistantPanel onClose={close} ask={ask} mood={pose} onMood={setAct} />
          </Suspense>
        </PanelBoundary>
      )}

      {hint && !open && (
        <div className="asst__hint">
          <button type="button" className="asst__hint-go" onClick={() => openPanel(HINTS[hint])}>
            {HINTS[hint].text}
          </button>
          <button
            type="button"
            className="asst__icon"
            aria-label="Hide Sukaram's tips"
            onClick={() => {
              hintsOff.current = true;
              setHint(null);
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        ref={fab}
        type="button"
        className="asst__fab"
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? "Close Sukaram, the Codefloor IT assistant" : "Chat with Sukaram, the Codefloor IT assistant"}
        onClick={() => (open ? close() : openPanel())}
      >
        <Robot mood={pose} />
      </button>
    </div>
  );
}
