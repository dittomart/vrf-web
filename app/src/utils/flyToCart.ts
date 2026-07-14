/** The dot that arcs from an ADD button into the cart icon.
    Ported from app.js flyToCart(). */
export function flyToCart(srcEl: HTMLElement | null): void {
  const cart =
    document.querySelector<HTMLElement>('[data-cart-badge]') ??
    document.querySelector<HTMLElement>('#bottom-nav a[href="/cart"]');
  if (!srcEl || !cart) return;

  const s = srcEl.getBoundingClientRect();
  const t = cart.getBoundingClientRect();

  const dot = document.createElement('div');
  dot.className = 'fly';
  dot.style.left = `${s.left + s.width / 2 - 11}px`;
  dot.style.top = `${s.top + s.height / 2 - 11}px`;
  document.body.appendChild(dot);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);

  dot.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 60}px) scale(1.1)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 0.4 },
    ],
    { duration: 650, easing: 'cubic-bezier(.5,-0.3,.5,1)' }
  ).onfinish = () => dot.remove();

  cart.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }],
    { duration: 400, delay: 600 }
  );
}
