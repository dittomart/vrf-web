import { useState, type ImgHTMLAttributes } from 'react';

/* A photo that fails to load (dead CDN id, offline) degrades to the neutral
   tinted .img-fallback tile instead of a broken-image glyph + stray alt text —
   the same behaviour app.js installed as a global capture-phase error handler. */
export function SmartImage({ className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      {...props}
      src={failed ? undefined : props.src}
      loading={props.loading ?? 'lazy'}
      onError={() => setFailed(true)}
      className={failed ? `${className} img-fallback` : className}
    />
  );
}
