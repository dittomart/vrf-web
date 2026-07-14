import { useEffect } from 'react';

/* The delegated pointerdown ripple app.js installed on every `.ripple` button.
   Mounted once at the app root so it works on any element, including ones
   rendered later. */
export function useRipple(): void {
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const b = target.closest<HTMLElement>('.ripple');
      if (!b) return;

      const r = b.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const s = document.createElement('span');
      s.style.cssText = `position:absolute;border-radius:9999px;background:rgba(255,255,255,.4);pointer-events:none;width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px;transform:scale(0);opacity:1`;
      b.style.position = b.style.position || 'relative';
      b.style.overflow = 'hidden';
      b.appendChild(s);

      s.animate(
        [
          { transform: 'scale(0)', opacity: 0.6 },
          { transform: 'scale(2.4)', opacity: 0 },
        ],
        { duration: 600, easing: 'ease-out' }
      ).onfinish = () => s.remove();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);
}
