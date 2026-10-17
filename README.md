# Codefloor IT — codefloorit.in

React 19 + Vite + React Router. Plain CSS (tokens in `src/styles/index.css`), Lucide icons,
no animation library. Every route is prerendered to static HTML at build time and hydrated.

```bash
npm install
npm run dev       # dev server
npm run build     # client build + SSR build + prerender (dist/*.html, sitemap.xml, llms.txt)
npm run check     # verifies dist: links, titles, canonicals, one <h1>, no removed services
npm run lint      # oxlint
npm run preview   # serve dist/
```

## Motion and scenes

No animation library. `src/lib/motion.js` runs one shared scroll loop that writes a
progress value (`--p`) to registered elements; the stylesheet turns it into movement.
Pinned scenes (home hero, portfolio) are `position: sticky` inside a tall wrapper, enabled
only on desktop-sized, tall-enough viewports without reduced motion (see "Scenes" in
`src/styles/index.css`); everywhere else they are ordinary sections.

The robot (`components/Robot.jsx`) is an SVG with CSS poses. Sections choose its pose with
`data-robot="idle|point|explore|think|greet"`. The robot is named Sukaram. Everything he
knows and says lives in `src/data/sukaram.js` (greeting, suggested questions, answers,
keyword matching for typed questions, section tips); `components/Assistant.jsx` and
`AssistantPanel.jsx` only render it. He is a scripted guide, not an AI model, and says so
in the panel header — to add real AI, replace `respond()` in that file with a call to your
own backend. Once per browsing session, as soon as the hero stage and its speech bubble are on
screen, the hero robot (`components/HeroVisual.jsx`) plays the `INTRO` sequence from that file
(`sessionStorage` key `sukaram-intro-seen`; open a new tab to see it again). Tapping his face,
belly, antenna or hands plays a reaction; tapping the rest of him or "Click on Me!" replays the
introduction. The hero robot never opens the chat: only the floating button does.
Sections can offer a one-line tip
with `data-robot-hint="services|work|process|contact"`. Run `node scripts/check-sukaram.mjs`
after editing his answers.

3D scenes (`components/three/scene.js`, mounted by `Scene3D.jsx`) use three.js with models built
from primitives - no model files. The three.js chunk (~136 KB gzipped) is downloaded only on
desktop screens with a mouse, without reduced motion or data saver, when a canvas nears the viewport.

## Content lives in `src/data/`

- `services.js` — the six services offered. **Do not add services without approval.**
- `solutions.js` — use-case categories (what can be built; not client claims).
- `projects.js` — real projects only. Keep `status` honest (`Completed` / `In Development`).
- `insights.js` — articles. `tech.js` — technology list. `site.js` — contact, nav, process, FAQ.

Adding a service, project or article automatically adds its page, sitemap entry and links.

## Contact form

There is no backend. Until `VITE_CONTACT_ENDPOINT` is set (see `.env.example`), the form
validates and then opens WhatsApp (number in `src/data/site.js`) with the message filled
in — it never reports a send that did not happen. With the variable set, it POSTs JSON
(`name, email, phone, company, service, details`) and shows success only on a 2xx response.
The hidden honeypot field is a first filter; add server-side spam protection at the endpoint.

## Deployment

Static output in `dist/`. `vercel.json` enables clean URLs (`/services` -> `services.html`);
unknown URLs get `404.html`. The canonical host is `https://www.codefloorit.in` because Vercel
serves www and redirects the bare domain to it. If that changes, update `SITE_URL` in
`src/lib/seo.js`, `index.html`, `public/robots.txt` and `scripts/check-dist.mjs`.

Project visuals are illustrative CSS mockups (labelled as such). Replace `Mockup` in
`src/components/cards.jsx` with real screenshots when available.
