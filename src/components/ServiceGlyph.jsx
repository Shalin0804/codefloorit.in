/* One small layered illustration per service. Each has a back and a front layer;
   the front layer drifts with the pointer (see .glyph in the stylesheet).
   Classes: g-a soft panel, g-b blue, g-c cyan, g-v violet, g-n navy, g-w white, g-l line. */

const GLYPHS = {
  "custom-software-development": [
    <rect key="b" className="g-a" x="20" y="18" width="120" height="76" rx="12" />,
    <>
      <rect className="g-b" x="34" y="32" width="36" height="26" rx="7" />
      <rect className="g-c" x="76" y="32" width="50" height="26" rx="7" />
      <rect className="g-v" x="34" y="64" width="60" height="18" rx="7" />
      <rect className="g-w" x="100" y="64" width="26" height="18" rx="7" />
    </>,
  ],
  "web-application-development": [
    <>
      <rect className="g-a" x="14" y="14" width="132" height="84" rx="12" />
      <rect className="g-n" x="22" y="22" width="26" height="68" rx="7" />
      <path className="g-l" d="M60 30 h58" />
    </>,
    <>
      <rect className="g-b" x="60" y="62" width="13" height="28" rx="3" />
      <rect className="g-c" x="79" y="48" width="13" height="42" rx="3" />
      <rect className="g-v" x="98" y="56" width="13" height="34" rx="3" />
      <rect className="g-b" x="117" y="40" width="13" height="50" rx="3" />
    </>,
  ],
  "business-website-development": [
    <>
      <rect className="g-a" x="14" y="14" width="132" height="84" rx="12" />
      <circle className="g-b" cx="26" cy="25" r="3" />
      <circle className="g-c" cx="36" cy="25" r="3" />
      <circle className="g-v" cx="46" cy="25" r="3" />
    </>,
    <>
      <rect className="g-n" x="26" y="40" width="60" height="10" rx="5" />
      <path className="g-l" d="M26 62 h44" />
      <rect className="g-b" x="26" y="72" width="36" height="14" rx="7" />
      <rect className="g-c" x="100" y="38" width="34" height="48" rx="9" />
    </>,
  ],
  "ecommerce-development": [
    <>
      <rect className="g-a" x="22" y="14" width="76" height="84" rx="12" />
      <rect className="g-v" x="32" y="24" width="56" height="36" rx="8" />
      <path className="g-l" d="M32 72 h36 M32 84 h22" />
    </>,
    <>
      <rect className="g-b" x="84" y="60" width="60" height="34" rx="12" />
      <circle className="g-w" cx="102" cy="77" r="6" />
      <path className="g-l g-l--w" d="M114 77 h18" />
      <circle className="g-c" cx="128" cy="34" r="15" />
    </>,
  ],
  "website-modernization": [
    <>
      <rect className="g-a g-dash" x="12" y="30" width="76" height="62" rx="10" />
      <path className="g-l" d="M24 48 h40 M24 62 h28" />
    </>,
    <>
      <rect className="g-w g-edge" x="70" y="14" width="78" height="66" rx="12" />
      <rect className="g-b" x="82" y="26" width="42" height="9" rx="4.5" />
      <rect className="g-c" x="82" y="43" width="54" height="7" rx="3.5" />
      <rect className="g-v" x="82" y="58" width="28" height="12" rx="6" />
      <path className="g-l g-l--b" d="M40 100 q32 8 56 -10 m-10 0 h10 v10" />
    </>,
  ],
  "maintenance-technical-support": [
    <>
      <rect className="g-a" x="14" y="18" width="132" height="72" rx="12" />
      <path className="g-l g-l--b" d="M24 56 h24 l10 -22 l14 42 l10 -20 h34" />
    </>,
    <>
      <circle className="g-b" cx="124" cy="76" r="19" />
      <path className="g-l g-l--w" d="M115 76 l6 6 l12 -13" />
    </>,
  ],
};

export default function ServiceGlyph({ slug }) {
  const [back, front] = GLYPHS[slug];
  return (
    <svg className="glyph" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
      <g className="glyph__back">{back}</g>
      <g className="glyph__front">{front}</g>
    </svg>
  );
}
