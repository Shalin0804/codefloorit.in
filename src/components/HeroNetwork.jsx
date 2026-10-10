import { useEffect, useRef } from "react";
import { canAnimate } from "../lib/motion";

const NODES = 44;
const LINK = 150; // px: nodes closer than this are joined

/* Slow-drifting network of connected nodes behind the hero. Decorative only.
   Desktop only; skipped for reduced motion / low-powered devices; paused whenever
   the hero is off screen or the tab is hidden. */
export default function HeroNetwork() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canAnimate() || window.innerWidth < 900) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pts = Array.from({ length: NODES }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
    }));
    let w = 0;
    let h = 0;
    let raf = 0;
    let onScreen = false;

    const size = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      for (let i = 0; i < NODES; i++) {
        const a = pts[i];
        for (let j = i + 1; j < NODES; j++) {
          const b = pts[j];
          const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
          if (d > LINK) continue;
          ctx.strokeStyle = `rgba(22, 119, 255, ${(1 - d / LINK) * 0.22})`;
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.stroke();
        }
        ctx.fillStyle = i % 5 === 0 ? "rgba(124, 92, 255, 0.7)" : "rgba(22, 119, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(a.x * w, a.y * h, i % 5 === 0 ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });

    size();
    io.observe(canvas);
    window.addEventListener("resize", size, { passive: true });
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} className="hero__net" aria-hidden="true" />;
}
