import { lazy, Suspense, useEffect, useState } from 'react';

const NeonScene = lazy(() => import('./neon-scene'));

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function NeonArenaBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="neon-stage" aria-hidden>
      <div className="uv-haze" />
      {reduced ? (
        <div className="uv-static-orbits" />
      ) : (
        <div className="neon-canvas">
          <Suspense fallback={null}>
            <NeonScene />
          </Suspense>
        </div>
      )}
      <div className="uv-vignette" />
    </div>
  );
}
