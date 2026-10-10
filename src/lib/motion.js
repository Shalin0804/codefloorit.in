import { useEffect, useRef } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Scroll-triggered reveal: one shared observer adds .is-in ---------- */

let revealObserver;
function getRevealObserver() {
  revealObserver ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        revealObserver.unobserve(e.target);
      }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  return revealObserver;
}

export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = getRevealObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

/* ---------- Scroll progress: writes --p to the element ----------
   mode "through": -1 (entering from below) .. 1 (left at top)  -> parallax
   mode "fill":     0 .. 1 as the element crosses the viewport middle -> timeline line
   mode "pin":      0 .. 1 across a tall wrapper whose child is position: sticky -> pinned scenes
   mode "enter":    0 .. 1 while the element's top travels up the viewport -> zoom-in entrances
   One passive scroll listener + one rAF for every registered element. */

const tracked = new Map();
let ticking = false;

function measure() {
  ticking = false;
  const vh = window.innerHeight;
  const unit = (n) => Math.min(1, Math.max(0, n));
  tracked.forEach(({ mode, cb }, el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    let p;
    if (mode === "fill") p = unit((vh * 0.6 - r.top) / r.height);
    else if (mode === "pin") p = r.height > vh ? unit(-r.top / (r.height - vh)) : 0;
    else if (mode === "enter") p = unit((vh - r.top) / (vh * 0.8));
    else p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
    el.style.setProperty("--p", p.toFixed(3));
    cb.current?.(p);
  });
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(measure);
}

export function useScrollProgress(mode = "through", onProgress) {
  const ref = useRef(null);
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });
  useEffect(() => {
    const el = ref.current;
    if (reduced()) {
      if (mode === "fill") el.style.setProperty("--p", 1);
      return;
    }
    if (tracked.size === 0) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }
    tracked.set(el, { mode, cb });
    onScroll();
    return () => {
      tracked.delete(el);
      if (tracked.size === 0) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
  }, [mode]);
  return ref;
}

/* ---------- Pointer effects (fine pointers only, off for reduced motion) ---------- */

/** Magnetic pull: the element drifts a few pixels toward the pointer. */
export function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!strength || reduced() || !finePointer()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return ref;
}

/** Writes pointer position (-1..1) as --px / --py on the element, for tilt and depth. */
export function usePointerVars() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (reduced() || !finePointer()) return;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    el.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
    };
  }, []);
  return ref;
}

/** Delegated handler for card grids: sets --mx / --my on the hovered .spot card. */
export function spotlight(e) {
  const card = e.target.closest?.(".spot");
  if (!card) return;
  const r = card.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  card.style.setProperty("--mx", `${x}px`);
  card.style.setProperty("--my", `${y}px`);
  card.style.setProperty("--nx", ((x / r.width) * 2 - 1).toFixed(2));
  card.style.setProperty("--ny", ((y / r.height) * 2 - 1).toFixed(2));
}

/** One document-level listener drives every .spot card (fine pointers only). */
export function useSpotlight() {
  useEffect(() => {
    if (reduced() || !finePointer()) return;
    document.addEventListener("pointermove", spotlight, { passive: true });
    return () => document.removeEventListener("pointermove", spotlight);
  }, []);
}

/** True when continuous decorative animation is appropriate on this device. */
export const canAnimate = () => !reduced() && !document.documentElement.classList.contains("lite");

/** Page scroll progress bar: scales the element on the X axis from 0 to 1. */
export function useScrollBar() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0})`;
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return ref;
}
