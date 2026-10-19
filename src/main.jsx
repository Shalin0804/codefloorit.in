import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/space-grotesk/wght.css";
import App from "./App";
import { initFx } from "./lib/fx";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Reveal animations are opt-in: content is only hidden once this script runs, so a
// failed or blocked bundle never leaves the page blank. Anything already on screen
// is marked revealed first to avoid a flash.
const html = document.documentElement;
if (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2 || navigator.connection?.saveData) {
  html.classList.add("lite"); // low-powered device or data saver: drop continuous effects
}
document.querySelectorAll(".reveal").forEach((el) => {
  if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
});
html.classList.add("anim");
initFx();

// Production pages are prerendered (scripts/prerender.mjs) and hydrated; dev starts empty.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
