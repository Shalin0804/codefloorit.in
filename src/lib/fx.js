import { canAnimate, finePointer } from "./motion";

/* Pointer effects for desktops with a mouse: a soft light that follows the cursor, cards
   that tilt toward it, and short labels that "decode" on hover. Everything is delegated
   from the document, so it covers every page and component without wiring. Skipped for
   touch, reduced motion and low-powered devices (.lite). */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const SCRAMBLE = ".nav__link, .eyebrow, .alink, .btn";
const TILT = ".card, .tech__card, .wpanel__media";
const MAX_TILT = 6; // degrees

/** Re-types the element's first text node through random glyphs, left to right. */
function scramble(el) {
  const node = [...el.childNodes].find((n) => n.nodeType === 3 && n.nodeValue.trim());
  if (!node || el.dataset.fxBusy) return;
  el.dataset.fxBusy = "1";
  const text = node.nodeValue;
  const start = performance.now();
  const step = (now) => {
    const shown = Math.floor(((now - start) / 420) * text.length);
    if (shown >= text.length) {
      node.nodeValue = text;
      delete el.dataset.fxBusy;
      return;
    }
    let out = text.slice(0, shown);
    for (let i = shown; i < text.length; i++) out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    node.nodeValue = out;
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initFx() {
  if (!canAnimate() || !finePointer()) return;
  const html = document.documentElement;
  html.classList.add("fx");

  const glow = document.createElement("div");
  glow.className = "fx-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let raf = 0;
  let tilted = null;

  const paint = () => {
    raf = 0;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  document.addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);

      const card = e.target.closest?.(TILT);
      if (tilted && tilted !== card) {
        tilted.style.removeProperty("--tx");
        tilted.style.removeProperty("--ty");
      }
      tilted = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--tx", `${((x - r.left) / r.width - 0.5) * 2 * MAX_TILT}deg`);
      card.style.setProperty("--ty", `${((y - r.top) / r.height - 0.5) * -2 * MAX_TILT}deg`);
    },
    { passive: true }
  );

  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest?.(SCRAMBLE);
    if (el && !el.contains(e.relatedTarget)) scramble(el);
  });
}
