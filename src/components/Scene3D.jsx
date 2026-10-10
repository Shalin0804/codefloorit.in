import { useEffect, useRef } from "react";
import { canAnimate, finePointer } from "../lib/motion";

/* Decorative WebGL canvas. three.js is only downloaded on desktop-sized screens with a
   mouse, without reduced motion or data saver, and only once the canvas is near the
   viewport. It renders only while on screen. Everywhere else the canvas stays empty. */
export default function Scene3D({ kind = "cluster" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canAnimate() || !finePointer() || window.innerWidth < 900) return;

    let api = null;
    let dead = false;
    let loading = false;
    let visible = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (api) return visible ? api.start() : api.stop();
        if (!visible || loading) return;
        loading = true;
        import("./three/scene.js")
          .then(({ mount }) => {
            if (dead) return;
            api = mount(canvas, kind);
            if (!api) return;
            canvas.classList.add("is-ready");
            if (visible) api.start();
          })
          .catch(() => {}); // decorative: a failed download just leaves the canvas empty
      },
      { rootMargin: "200px" }
    );
    // wait for the page to settle so the 3D code never competes with first paint
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 600));
    const handle = idle(() => io.observe(canvas));

    return () => {
      dead = true;
      (window.cancelIdleCallback ?? clearTimeout)(handle);
      io.disconnect();
      api?.dispose();
    };
  }, [kind]);

  return <canvas ref={ref} className={`s3d s3d--${kind}`} aria-hidden="true" />;
}
