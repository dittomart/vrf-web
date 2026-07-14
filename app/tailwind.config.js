/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Start from an EMPTY palette. Only the brand's tokens exist.
    // Every hue is a live CSS custom property so assets/themes.js's
    // successor (src/theme/themes.ts) can re-skin the app at runtime.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fff',
      black: '#000',

      primary: 'var(--primary)',
      'primary-2': 'var(--primary-2)',
      accent: 'var(--accent)',
      'accent-2': 'var(--accent-2)',
      'accent-soft': 'var(--accent-soft)',
      'accent-on': 'var(--accent-on)',
      gold: 'var(--gold)',
      'gold-soft': 'var(--gold-soft)',
      canvas: 'var(--canvas)',
      'canvas-2': 'var(--canvas-2)',
      surface: 'var(--surface)',
      ink: 'var(--ink)',
      'ink-2': 'var(--ink-2)',
      line: 'var(--line)',

      // back-compat aliases the markup still uses
      brand: 'var(--brand)',
      'brand-2': 'var(--brand-2)',
      'brand-soft': 'var(--brand-soft)',
      green: 'var(--green)',
      'green-2': 'var(--green-2)',
      ivory: 'var(--ivory)',
      'ivory-2': 'var(--ivory-2)',
      cream: 'var(--cream)',
      card: 'var(--card)',
    },
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      boxShadow: {
        e1: 'var(--e1)',
        e2: 'var(--e2)',
        e3: 'var(--e3)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(.2,.7,.3,1)',
      },
      transitionDuration: {
        fast: '160ms',
        base: '240ms',
        slow: '400ms',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(.97)' }, to: { opacity: '1', transform: 'none' } },
        drift: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        fadeup: 'fadeUp .6s cubic-bezier(.2,.7,.3,1) both',
        fadein: 'fadeIn .5s ease both',
        scalein: 'scaleIn .45s cubic-bezier(.2,.7,.3,1) both',
        drift: 'drift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
