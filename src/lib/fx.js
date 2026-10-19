import { canAnimate, finePointer } from "./motion";

/* Pointer effects for desktops with a mouse: a soft light and a HUD reticle that follow the
   cursor, cards that tilt toward it, short labels that "decode" on hover, and section
   headings that decode word by word as they scroll into view. Everything is delegated
   from the document, so it covers every page and component without wiring. Skipped for
   touch, reduced motion and low-powered devices (.lite). */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const SCRAMBLE = ".nav__link, .eyebrow, .alink, .btn";
const TILT = ".card, .tech__card, .wpanel__media";
const MAX_TILT = 6; // degrees
const HOT = "a, button, summary, select, input, textarea, [role='button']";

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

  // the reticle trails the pointer a little and locks onto anything clickable
  const reticle = document.createElement("div");
  reticle.className = "fx-reticle";
  reticle.setAttribute("aria-hidden", "true");
  document.body.appendChild(reticle);

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let rx = x;
  let ry = y;
  let raf = 0;
  let tilted = null;

  const paint = () => {
    rx += (x - rx) * 0.25;
    ry += (y - ry) * 0.25;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    reticle.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.5 ? requestAnimationFrame(paint) : 0;
  };
  document.addEventListener("pointerdown", (e) => {
    reticle.classList.add("is-down");
    // shockwave at the click, and the origin for the next page's portal reveal
    const ring = document.createElement("span");
    ring.className = "fx-shock";
    ring.setAttribute("aria-hidden", "true");
    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
    ring.addEventListener("animationend", () => ring.remove());
    document.body.appendChild(ring);
    html.style.setProperty("--cx", `${e.clientX}px`);
    html.style.setProperty("--cy", `${e.clientY}px`);
  });
  document.addEventListener("pointerup", () => reticle.classList.remove("is-down"));
  document.documentElement.addEventListener("pointerleave", () => reticle.classList.add("is-away"));
  document.documentElement.addEventListener("pointerenter", () => reticle.classList.remove("is-away"));

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
    reticle.classList.toggle("is-hot", !!e.target.closest?.(HOT));
    const el = e.target.closest?.(SCRAMBLE);
    if (el && !el.contains(e.relatedTarget)) scramble(el);
  });

  // tickers speed up and lean with the scroll, then settle back
  let lastY = scrollY;
  let vel = 0;
  let spinning = 0;
  const settle = () => {
    vel *= 0.9;
    html.style.setProperty("--skew", `${Math.max(-12, Math.min(12, vel * -0.25)).toFixed(2)}deg`);
    for (const track of document.querySelectorAll(".mq__track")) {
      for (const a of track.getAnimations()) a.playbackRate = 1 + Math.min(6, Math.abs(vel) * 0.12);
    }
    spinning = Math.abs(vel) > 0.05 ? requestAnimationFrame(settle) : 0;
  };
  addEventListener(
    "scroll",
    () => {
      vel = vel * 0.6 + (scrollY - lastY) * 0.4;
      lastY = scrollY;
      if (!spinning) spinning = requestAnimationFrame(settle);
    },
    { passive: true }
  );

  // section headings decode once, word by word, when they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        entry.target.querySelectorAll(".sw > span").forEach((word, i) => setTimeout(() => scramble(word), 120 + i * 70));
      }
    },
    { threshold: 0.6 }
  );
  const watch = (root) => root.querySelectorAll?.(".shead__title").forEach((h) => io.observe(h));
  watch(document);
  // pages rendered later by the router bring new headings
  new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach(watch))).observe(document.getElementById("root"), {
    childList: true,
    subtree: true,
  });
}
