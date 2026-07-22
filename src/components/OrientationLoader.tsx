import { useEffect, useState } from "react";

/**
 * Shows a brief, elegant loading overlay while the layout swaps
 * between mobile (portrait) and desktop (landscape) on touch devices.
 * The layout swap itself is pure CSS (instant); this overlay just
 * masks any repaint/reflow so the transition feels intentional.
 */
const OrientationLoader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only meaningful on touch devices
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)");
    if (!touch.matches) return;

    let timeout: number | undefined;
    const handle = () => {
      setVisible(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setVisible(false), 550);
    };

    // Prefer the newer screen.orientation API; fall back to matchMedia
    const orientationMQ = window.matchMedia("(orientation: portrait)");
    orientationMQ.addEventListener?.("change", handle);
    window.addEventListener("orientationchange", handle);

    return () => {
      orientationMQ.removeEventListener?.("change", handle);
      window.removeEventListener("orientationchange", handle);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`orient-loader ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <div className="orient-loader-card">
        <div className="orient-loader-spinner" />
        <div className="orient-loader-text">Adjusting layout…</div>
      </div>
    </div>
  );
};

export default OrientationLoader;