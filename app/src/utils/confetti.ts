/** Confetti burst for the order-confirmation page. Pure DOM + WAAPI, no deps. */
export function confetti(count = 90): void {
  const colors = [
    'var(--gold)',
    'var(--primary)',
    'var(--accent)',
    'var(--gold-soft)',
    'var(--primary-2)',
  ];

  for (let i = 0; i < count; i++) {
    const bit = document.createElement('div');
    const size = 6 + (i % 5) * 2;
    bit.style.cssText = `position:fixed;top:-12px;left:${(i / count) * 100}%;width:${size}px;height:${size * 1.6}px;background:${colors[i % colors.length]};z-index:95;pointer-events:none;border-radius:2px`;
    document.body.appendChild(bit);

    const drift = (i % 7) * 18 - 54;
    const spin = (i % 2 ? 1 : -1) * (360 + (i % 5) * 180);

    bit.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${drift}px, ${window.innerHeight + 40}px) rotate(${spin}deg)`, opacity: 0.9 },
      ],
      {
        duration: 2200 + (i % 6) * 320,
        delay: (i % 10) * 60,
        easing: 'cubic-bezier(.25,.6,.4,1)',
      }
    ).onfinish = () => bit.remove();
  }
}
