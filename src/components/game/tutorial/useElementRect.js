import { useState, useEffect } from "react";

export function useElementRect(selector, active) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!active || !selector) return;
    const update = () => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
          bottom: r.bottom,
          right: r.right,
        });
      } else {
        setRect(null);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    const el = document.querySelector(selector);
    if (el) ro.observe(el);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [selector, active]);

  return rect;
}
