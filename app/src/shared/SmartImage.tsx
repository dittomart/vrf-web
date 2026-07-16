import { useEffect, useState, type ImgHTMLAttributes } from 'react';

/* A photo that cannot load — the kitchen never uploaded one, the file is missing
   on the host — degrades to the neutral tinted .img-fallback tile.

   It renders a <div>, not an <img> with no src: an empty or cleared `src` still
   paints the browser's broken-image glyph and the alt text next to it, which is
   exactly the "broken page" look this is meant to avoid. */
export function SmartImage({ className = '', alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const src = typeof props.src === 'string' ? props.src.trim() : '';
  const [failed, setFailed] = useState(false);

  // a new src deserves a fresh attempt — the component is reused across dishes
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={`${className} img-fallback`} role="img" aria-label={alt} />;
  }

  return (
    <img
      {...props}
      alt={alt}
      src={src}
      loading={props.loading ?? 'lazy'}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
