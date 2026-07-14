import { useEffect } from 'react';

/* Scroll reveal — the React equivalent of app.js's initReveal().
   Guards the two bugs the prototype documented: elements taller than the
   viewport never meeting a non-zero threshold, and nodes mounted after the
   observer was created never being picked up. */
export function useReveal(): void {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add('in');

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    const observe = (root: Node) => {
      if (!(root instanceof Element)) return;
      if (root.classList.contains('reveal') && !root.classList.contains('in')) io.observe(root);
      root.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    };

    observe(document.body);

    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach(observe));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    /* Failsafe: anything scrolled past but still unrevealed reads as a blank
       hole in the page — force it visible. */
    const onScroll = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}
