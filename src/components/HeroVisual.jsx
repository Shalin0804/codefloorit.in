import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, X } from "lucide-react";
import { INTRO, INTRO_SEEN_KEY } from "../data/sukaram";
import Robot from "./Robot";

/* Hero stage: Sukaram, the Codefloor IT robot, inside orbital rings, with floating glass
   interface panels. He introduces the company to first-time visitors in a speech bubble
   (the words live in data/sukaram.js) and reacts when you tap his face, belly, antenna
   or hands — tapping him, or the "Click on Me!" bubble, opens the chat (Assistant.jsx). */

const REACTIONS = {
  face: { mood: "angry", say: "Hey! Not the face!" },
  belly: { mood: "laugh", say: "Ha ha ha — that tickles!" },
  antenna: { mood: "surprised", say: "Whoa! Careful with that!" },
  hand: { mood: "five", say: "High five!" },
};
const ZONES = [
  ["antenna", "antenna", "Tap Sukaram's antenna"],
  ["face", "face", "Tap Sukaram's face"],
  ["belly", "belly", "Tickle Sukaram's belly"],
  ["hand-l", "hand", "High-five Sukaram's left hand"],
  ["hand-r", "hand", "High-five Sukaram's right hand"],
];
const LAST = INTRO.length - 1;

function HeroRobot({ pose, onPoke }) {
  const [reaction, setReaction] = useState(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const poke = (key) => {
    clearTimeout(timer.current);
    setReaction(key);
    timer.current = setTimeout(() => setReaction(null), 2600);
    onPoke();
  };

  return (
    <div className="hv__robot">
      <button type="button" className={`hv__cta ${reaction ? "is-off" : ""}`} aria-label="Click on me: chat with Sukaram, the Codefloor IT assistant" onClick={onPoke}>
        Click on Me!
      </button>
      <Robot mood={reaction ? REACTIONS[reaction].mood : pose} track />
      <button
        type="button"
        className="hv__tap"
        aria-label="Chat with Sukaram, the Codefloor IT assistant"
        onClick={onPoke}
      />
      {ZONES.map(([zone, key, label]) => (
        <button key={zone} type="button" className={`hv__zone hv__zone--${zone}`} aria-label={label} onClick={() => poke(key)} />
      ))}
      <output className={`hv__say ${reaction ? "is-on" : ""}`}>{reaction && REACTIONS[reaction].say}</output>
    </div>
  );
}

/* One bubble of the introduction. It moves on by itself after a reading pause, unless
   the visitor is pointing at it or has keyboard focus inside it. */
function Intro({ step, setStep }) {
  const [held, setHeld] = useState(false);
  const { text, items, actions } = INTRO[step];

  useEffect(() => {
    if (step >= LAST || held) return;
    const t = setTimeout(() => setStep(step + 1), items ? 9000 : Math.min(8000, 2400 + text.length * 30));
    return () => clearTimeout(t);
  }, [step, held, text, items, setStep]);

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- listens for hover/focus inside to pause, it is not a control itself
    <section
      className="hvi"
      aria-label="Sukaram introduces Codefloor IT"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <header className="hvi__head">
        <b>Sukaram</b>
        <span className="hvi__dots" aria-hidden="true">
          {INTRO.map((_, i) => (
            <i key={i} className={i <= step ? "is-on" : undefined} />
          ))}
        </span>
        {step < LAST && (
          <>
            <button type="button" className="hvi__ctl" onClick={() => setStep(LAST)}>Skip</button>
            <button type="button" className="hvi__ctl hvi__ctl--next" onClick={() => setStep(step + 1)}>
              Next <ArrowRight size={14} aria-hidden="true" />
            </button>
          </>
        )}
        <button type="button" className="asst__icon" onClick={() => setStep(-1)} aria-label="Close Sukaram's introduction">
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div aria-live="polite">
        <div key={step}>
          <p className="hvi__text">
            {text.split(" ").map((word, i) => (
              <span key={i} style={{ animationDelay: `${0.1 + i * 0.03}s` }}>{word} </span>
            ))}
          </p>
          {items && (
            <ul className="hvi__list">
              {items.map((item, i) => (
                <li key={item.to} style={{ animationDelay: `${0.5 + i * 0.22}s` }}>
                  <Link to={item.to}>
                    <b>{item.title}</b>
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {actions && (
            <div className="hvi__actions">
              {actions.map((a, i) => (
                <Link key={a.to} to={a.to} className="hvi__go" style={{ animationDelay: `${0.6 + i * 0.12}s` }}>
                  {a.label} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const hex = (r) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(260 + r * Math.cos(a)).toFixed(1)},${(260 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

export default function HeroVisual() {
  const [step, setStep] = useState(-1); // -1: introduction closed

  // First visit only: once the hero has settled, Sukaram starts talking by himself.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (localStorage.getItem(INTRO_SEEN_KEY) || document.getElementById("assistant-panel")) return;
        localStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        return; // storage blocked: stay quiet rather than repeat on every visit; tapping him still works
      }
      setStep((s) => Math.max(s, 0));
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const pose = step < 0 ? "idle" : step === 0 ? "greet" : step === LAST ? "happy" : INTRO[step].items ? "point" : "talk";

  return (
    <div className="hvx">
      <div className="hv">
        <div className="hv__glow" aria-hidden="true" />
        <svg className="hv__svg" viewBox="0 0 520 520" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="hv-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00D4FF" />
              <stop offset="0.6" stopColor="#1677FF" />
              <stop offset="1" stopColor="#7C5CFF" />
            </linearGradient>
          </defs>
          <polygon points={hex(252)} stroke="#1677FF" strokeOpacity=".14" />
          <polygon points={hex(196)} stroke="url(#hv-g)" strokeOpacity=".35" />
          <g className="hv__ring hv__ring--a">
            <circle cx="260" cy="260" r="224" stroke="url(#hv-g)" strokeOpacity=".7" strokeDasharray="2 10" strokeLinecap="round" strokeWidth="2" />
            <circle cx="484" cy="260" r="6" fill="#00D4FF" />
            <circle cx="36" cy="260" r="4" fill="#7C5CFF" />
          </g>
          <g className="hv__ring hv__ring--b">
            <circle cx="260" cy="260" r="160" stroke="#10243A" strokeOpacity=".12" />
            <circle cx="260" cy="100" r="5" fill="#1677FF" />
            <circle cx="398.6" cy="340" r="4" fill="#00D4FF" />
          </g>
        </svg>

        <HeroRobot
          pose={pose}
          onPoke={() => {
            setStep(-1); // the chat panel takes over from the introduction bubble
            window.dispatchEvent(new Event("sukaram:open"));
          }}
        />

        <div className="hv__panel hv__panel--code" aria-hidden="true">
          <div className="hv__dots"><i /><i /><i /></div>
          <span style={{ width: "62%" }} className="c1" />
          <span style={{ width: "84%" }} />
          <span style={{ width: "46%" }} className="c2" />
          <span style={{ width: "70%" }} />
        </div>
        <div className="hv__panel hv__panel--chart" aria-hidden="true">
          <div className="hv__bars"><i /><i /><i /><i /><i /></div>
          <span style={{ width: "58%" }} />
        </div>
        <div className="hv__panel hv__panel--layers" aria-hidden="true">
          <b>Interface</b>
          <b>Logic</b>
          <b>Data</b>
        </div>
      </div>
      {step >= 0 && <Intro step={step} setStep={setStep} />}
    </div>
  );
}
