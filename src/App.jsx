import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router";
import "./styles/index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Assistant from "./components/Assistant";
import Home from "./pages/Home";
import { useScrollBar, useSpotlight } from "./lib/motion";

/* After a deploy, a tab still running the old build asks for page files that no longer exist.
   Load the page fresh instead of showing a blank screen (at most once a minute, so an outage cannot loop). */
const page = (load) =>
  lazy(() =>
    load().catch((err) => {
      try {
        if (Date.now() - Number(sessionStorage.getItem("chunk-reload")) < 60000) throw err;
        sessionStorage.setItem("chunk-reload", Date.now());
      } catch {
        throw err;
      }
      location.reload();
      return new Promise(() => {});
    })
  );

const Services = page(() => import("./pages/Services"));
const ServiceDetail = page(() => import("./pages/ServiceDetail"));
const Solutions = page(() => import("./pages/Solutions"));
const Work = page(() => import("./pages/Work"));
const ProjectDetail = page(() => import("./pages/ProjectDetail"));
const About = page(() => import("./pages/About"));
const Insights = page(() => import("./pages/Insights"));
const ArticleDetail = page(() => import("./pages/ArticleDetail"));
const Contact = page(() => import("./pages/Contact"));
const Legal = page(() => import("./pages/Legal"));
const NotFound = page(() => import("./pages/NotFound"));

/** Scroll to the hash target, or to the top (and move focus to <main>) on page change. */
function useRouteScroll() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const initial = first.current;
    first.current = false;
    if (hash) return document.getElementById(hash.slice(1))?.scrollIntoView();
    if (initial) return;
    document.documentElement.classList.add("navd"); // enables the page-enter animation after the first load
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash]);
}

export default function App() {
  useRouteScroll();
  useSpotlight();
  const bar = useScrollBar();
  const { pathname } = useLocation();
  return (
    <>
      <div className="progress" aria-hidden="true"><i ref={bar} /></div>
      <a href="#main" className="skip">Skip to content</a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="route-fallback" />}>
          <div className="page" key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<ArticleDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Legal kind="privacy" />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <Assistant />
    </>
  );
}
