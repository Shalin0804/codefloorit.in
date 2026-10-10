import { useEffect, useId, useRef } from "react";
import { canAnimate, finePointer } from "../lib/motion";

/* Sukaram, the Codefloor IT robot: a layered, shaded SVG character animated with CSS.
   `mood` picks the pose and expression:
     section poses — idle | point | explore | think | greet
     conversation  — talk | listen | happy | farewell
     reactions     — angry | laugh | surprised | five
   `track` makes the face follow the pointer (large hero robot only).
   Glow colour comes from the CSS variable --eye, so moods can recolour it. */
export default function Robot({ mood = "idle", track = false, className = "" }) {
  const id = `rb${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!track || !canAnimate() || !finePointer()) return;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const clamp = (n) => Math.max(-1, Math.min(1, n));
        el.style.setProperty("--ex", clamp((e.clientX - (r.left + r.width / 2)) / 320).toFixed(2));
        el.style.setProperty("--ey", clamp((e.clientY - (r.top + r.height * 0.3)) / 260).toFixed(2));
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [track]);

  const u = (n) => `url(#${id}${n})`;
  /* A shell part = base colour + a soft shadow falling away from the top-left light. */
  const shell = (props) => (
    <>
      <rect {...props} fill={u("s")} stroke="#b7c6d9" />
      <rect {...props} fill={u("d")} />
    </>
  );
  const arm = (side, x) => (
    <g className={`rb__arm rb__arm--${side}`}>
      {shell({ x: x - 14, y: 170, width: 28, height: 42, rx: 14 })}
      <g className={`rb__fore rb__fore--${side}`}>
        {shell({ x: x - 12, y: 206, width: 24, height: 38, rx: 12 })}
        <circle cx={x} cy="250" r="13" fill={u("a")} />
        <circle cx={x} cy="250" r="13" fill={u("d")} />
        <path d={`M${x - 6} 256 q6 5 12 0`} stroke="#0b1a2c" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx={x - 4} cy="245" r="3" fill="#fff" opacity="0.7" />
      </g>
      <circle cx={x} cy="211" r="8" fill={u("m")} />
    </g>
  );

  return (
    <svg ref={ref} className={`rb ${className}`} data-mood={mood} viewBox="0 0 260 320" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#edf3f9" />
          <stop offset="1" stopColor="#cbd8e7" />
        </linearGradient>
        <radialGradient id={`${id}d`} cx="0.3" cy="0.22" r="0.95">
          <stop offset="0.5" stopColor="#10243a" stopOpacity="0" />
          <stop offset="1" stopColor="#10243a" stopOpacity="0.24" />
        </radialGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00d4ff" />
          <stop offset="0.6" stopColor="#1677ff" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#07121f" />
          <stop offset="1" stopColor="#1e3a60" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3d0df" />
          <stop offset="1" stopColor="#7c90a8" />
        </linearGradient>
        <radialGradient id={`${id}j`}>
          <stop offset="0" stopColor="#7df0ff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#00d4ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}f`}>
          <stop offset="0" stopColor="#10243a" stopOpacity="0.32" />
          <stop offset="1" stopColor="#10243a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse className="rb__shadow" cx="130" cy="306" rx="62" ry="10" fill={u("f")} />

      <g className="rb__float">
        <ellipse className="rb__jet" cx="130" cy="270" rx="38" ry="22" fill={u("j")} />

        {arm("l", 58)}
        {arm("r", 202)}

        {/* torso */}
        <g className="rb__body">
          {shell({ x: 70, y: 160, width: 120, height: 106, rx: 46 })}
          <ellipse cx="102" cy="174" rx="24" ry="6" fill="#fff" opacity="0.8" transform="rotate(-14 102 174)" />
          <path d="M84 232 q46 22 92 0" stroke="#b3c3d6" strokeWidth="1.5" fill="none" />
          <rect x="96" y="180" width="68" height="46" rx="18" fill={u("v")} stroke="#00d4ff" strokeOpacity="0.3" />
          <rect x="101" y="184" width="34" height="12" rx="6" fill={u("g")} />
          <circle cx="130" cy="204" r="14" fill="#07121f" stroke={u("a")} strokeWidth="3.5" />
          <circle className="rb__glow" cx="130" cy="204" r="12" />
          <circle className="rb__core" cx="130" cy="204" r="7" />
          <g className="rb__leds">
            <circle cx="118" cy="246" r="3" />
            <circle cx="130" cy="248" r="3" />
            <circle cx="142" cy="246" r="3" />
          </g>
        </g>

        <circle cx="72" cy="180" r="11" fill={u("m")} />
        <circle cx="188" cy="180" r="11" fill={u("m")} />
        <rect x="114" y="146" width="32" height="18" rx="5" fill={u("m")} />
        <path d="M116 152 h28 M116 158 h28" stroke="#5f738b" strokeOpacity="0.5" />

        <g className="rb__head">
          <path d="M130 44 V22" stroke={u("m")} strokeWidth="4" strokeLinecap="round" />
          <circle className="rb__glow rb__ant" cx="130" cy="16" r="14" />
          <circle className="rb__core rb__ant" cx="130" cy="16" r="7.5" />
          <circle cx="127.5" cy="13.5" r="2.2" fill="#fff" opacity="0.8" />

          <rect x="40" y="82" width="18" height="36" rx="9" fill={u("m")} />
          <rect x="202" y="82" width="18" height="36" rx="9" fill={u("m")} />
          <rect x="44" y="90" width="7" height="20" rx="3.5" fill={u("a")} />
          <rect x="209" y="90" width="7" height="20" rx="3.5" fill={u("a")} />

          {shell({ x: 54, y: 40, width: 152, height: 116, rx: 46 })}
          <ellipse cx="100" cy="55" rx="32" ry="7" fill="#fff" opacity="0.9" transform="rotate(-6 100 55)" />

          <rect x="70" y="64" width="120" height="68" rx="31" fill={u("v")} stroke="#00d4ff" strokeOpacity="0.32" strokeWidth="1.5" />
          <path d="M82 80 q10 -9 38 -9 h18 q-34 4 -50 22 z" fill={u("g")} />

          <g className="rb__face">
            <g className="rb__x rb__x--eyes">
              <circle className="rb__glow" cx="106" cy="94" r="16" />
              <circle className="rb__glow" cx="154" cy="94" r="16" />
              <ellipse className="rb__eye" cx="106" cy="94" rx="9" ry="12" />
              <ellipse className="rb__eye" cx="154" cy="94" rx="9" ry="12" />
              <circle cx="103" cy="89" r="2.6" fill="#fff" opacity="0.9" />
              <circle cx="151" cy="89" r="2.6" fill="#fff" opacity="0.9" />
            </g>
            <g className="rb__x rb__x--happy rb__line">
              <path d="M94 99 q12 -17 24 0" />
              <path d="M142 99 q12 -17 24 0" />
            </g>
            <g className="rb__x rb__x--angry">
              <circle className="rb__glow" cx="106" cy="96" r="15" />
              <circle className="rb__glow" cx="154" cy="96" r="15" />
              <path className="rb__eye" d="M92 85 L120 96 L118 104 Q106 109 95 101 Z" />
              <path className="rb__eye" d="M168 85 L140 96 L142 104 Q154 109 165 101 Z" />
            </g>
            <g className="rb__x rb__x--wide rb__line">
              <circle cx="106" cy="93" r="11" />
              <circle cx="154" cy="93" r="11" />
              <circle className="rb__eye" cx="106" cy="93" r="3.5" />
              <circle className="rb__eye" cx="154" cy="93" r="3.5" />
            </g>
            <g className="rb__x rb__x--wink">
              <circle className="rb__glow" cx="106" cy="94" r="16" />
              <ellipse className="rb__eye" cx="106" cy="94" rx="9" ry="12" />
              <path className="rb__line" d="M142 97 q12 -12 24 0" />
            </g>

            <path className="rb__x rb__x--m-smile rb__line" d="M121 116 q9 6 18 0" strokeWidth="3" />
            <path className="rb__x rb__x--m-laugh rb__eye" d="M115 111 h30 q-1 15 -15 15 q-14 0 -15 -15 z" />
            <path className="rb__x rb__x--m-angry rb__line" d="M116 121 l7 -6 l7 6 l7 -6 l7 6" strokeWidth="3" />
            <ellipse className="rb__x rb__x--m-o rb__line" cx="130" cy="118" rx="5" ry="6.5" strokeWidth="3" />
          </g>

          <g className="rb__x rb__steam">
            <circle cx="30" cy="74" r="7" />
            <circle cx="20" cy="58" r="5" />
            <circle cx="230" cy="74" r="7" />
            <circle cx="240" cy="58" r="5" />
          </g>
          <g className="rb__x rb__dots" fill={u("a")}>
            <circle cx="216" cy="34" r="4" />
            <circle cx="230" cy="21" r="5" />
            <circle cx="246" cy="8" r="6" />
          </g>
        </g>
      </g>
    </svg>
  );
}
