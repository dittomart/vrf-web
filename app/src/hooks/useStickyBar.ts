import { useEffect, useState } from 'react';

/** The app-bar gains its hairline + shadow only once the page is scrolled,
    so it sits flat against the canvas at rest. Mirrors app.js initStickyBar(). */
export function useStickyBar(): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let raf = 0;
    const sync = () => {
      raf = 0;
      setStuck(window.scrollY > 4);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    sync();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return stuck;
}
