import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, RotateCcw, Send, X } from "lucide-react";
import { BRIEF_KEY, FAILED, GREETING, SUGGESTIONS, reply, respond } from "../data/sukaram";
import Robot from "./Robot";

/* Sukaram's chat panel. It only renders the conversation: every word and every
   answer comes from data/sukaram.js. `ask` is a question to answer as soon as the
   panel opens (from the greeting bubble or a section tip). */

const HELLO = { from: "bot", text: GREETING };

export default function AssistantPanel({ onClose, ask, mood = "greet", onMood }) {
  const [messages, setMessages] = useState(ask ? [HELLO, { from: "user", text: ask.label }] : [HELLO]);
  const [options, setOptions] = useState(ask ? [] : SUGGESTIONS);
  const [typing, setTyping] = useState(Boolean(ask));
  const [draft, setDraft] = useState("");
  const log = useRef(null);
  const closeBtn = useRef(null);
  const timer = useRef(0);
  const rest = useRef(0);
  const turn = useRef(0);

  /* Waits a beat, then shows the reply. A newer question or "start over" cancels it. */
  function answer(getReply) {
    const id = ++turn.current;
    clearTimeout(timer.current);
    clearTimeout(rest.current);
    onMood("think");
    timer.current = setTimeout(async () => {
      let r;
      try {
        r = await getReply();
      } catch {
        r = FAILED;
      }
      if (id !== turn.current) return;
      const { options: next, mood: pose = "talk", ...msg } = r;
      setMessages((m) => [...m, { from: "bot", ...msg }]);
      setOptions(next);
      setTyping(false);
      onMood(pose);
      rest.current = setTimeout(() => onMood("idle"), 2600);
    }, 420);
  }

  function say(label, getReply) {
    setMessages((m) => [...m, { from: "user", text: label }]);
    setOptions([]);
    setTyping(true);
    answer(getReply);
  }

  useEffect(() => {
    closeBtn.current?.focus();
    if (ask) answer(() => reply(ask.node));
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      turn.current += 1;
      clearTimeout(timer.current);
      clearTimeout(rest.current);
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- `ask` is read once, when the panel opens
  }, [onClose]);

  useEffect(() => {
    log.current.scrollTop = log.current.scrollHeight;
  }, [messages, typing]);

  function send(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    // A real description is worth keeping: the contact form offers it back to the visitor.
    if (text.length >= 20) {
      try {
        sessionStorage.setItem(BRIEF_KEY, text);
      } catch {
        /* storage blocked: the visitor simply retypes it */
      }
    }
    say(text, () => respond(text));
  }

  function reset() {
    turn.current += 1;
    clearTimeout(timer.current);
    clearTimeout(rest.current);
    setMessages([HELLO]);
    setOptions(SUGGESTIONS);
    setTyping(false);
    onMood("greet");
  }

  return (
    <dialog open id="assistant-panel" className="asst__panel" aria-labelledby="assistant-title">
      <header className="asst__head">
        <span className="asst__avatar"><Robot mood={mood} /></span>
        <div>
          <h2 id="assistant-title">Sukaram</h2>
          <p>Codefloor IT assistant · prepared answers, not a live AI</p>
        </div>
        <button type="button" className="asst__icon" onClick={reset} aria-label="Start over">
          <RotateCcw size={18} aria-hidden="true" />
        </button>
        <button ref={closeBtn} type="button" className="asst__icon" onClick={onClose} aria-label="Close assistant">
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="asst__log" ref={log} role="log" aria-live="polite" aria-label="Conversation with Sukaram">
        {messages.map((m, i) => (
          <div key={i} className={`asst__msg asst__msg--${m.from}`}>
            <p>{m.text}</p>
            {m.list && (
              <ol>
                {m.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
            {m.links?.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="asst__link" onClick={onClose}>
                  {l.label} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="asst__link">
                  {l.label} <ArrowRight size={15} aria-hidden="true" />
                </a>
              )
            )}
          </div>
        ))}
        {typing && (
          <div className="asst__msg asst__msg--bot asst__typing" aria-label="Sukaram is preparing an answer">
            <i /><i /><i />
          </div>
        )}
      </div>

      <div className="asst__opts">
        {options.map((o) => (
          <button key={o.node} type="button" className="asst__opt" onClick={() => say(o.label, () => reply(o.node))}>
            {o.label}
          </button>
        ))}
      </div>

      <form className="asst__form" onSubmit={send}>
        <input
          className="asst__input"
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (typing) return;
            clearTimeout(rest.current);
            onMood("listen");
          }}
          onFocus={() => !typing && onMood("listen")}
          onBlur={() => !typing && onMood("idle")}
          placeholder="Ask about services, projects…"
          aria-label="Ask Sukaram a question"
          maxLength={300}
          autoComplete="off"
          enterKeyHint="send"
        />
        <button type="submit" className="asst__send" aria-label="Send question" disabled={!draft.trim() || typing}>
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </dialog>
  );
}
