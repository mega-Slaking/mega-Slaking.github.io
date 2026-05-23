import { useEffect, useRef, useState } from 'react';

const COLORS = ['#00aaff', '#00e5ff', '#33f6ff'];
const FULL_MOTION_DURATION = 560;
const REDUCED_MOTION_DURATION = 220;

function PixelClickEffect() {
  const [particles, setParticles] = useState([]);
  const particleId = useRef(0);
  const timeouts = useRef(new Set());
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      reducedMotion.current = mediaQuery.matches;
    };

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    const spawnBurst = (event) => {
      const count = reducedMotion.current ? 4 : 10;
      const duration = reducedMotion.current ? REDUCED_MOTION_DURATION : FULL_MOTION_DURATION;
      const baseDistance = reducedMotion.current ? 14 : 34;
      const nextParticles = Array.from({ length: count }, (_, index) => {
        const angle = (Math.PI * 2 * index) / count;
        const distance = baseDistance + Math.random() * (reducedMotion.current ? 10 : 34);
        const size = reducedMotion.current ? 4 : 4 + Math.floor(Math.random() * 5);
        const driftX = Math.cos(angle) * distance;
        const driftY = Math.sin(angle) * distance;

        return {
          id: particleId.current++,
          x: event.clientX,
          y: event.clientY,
          dx: driftX.toFixed(2),
          dy: driftY.toFixed(2),
          size,
          duration,
          color: COLORS[index % COLORS.length],
          rotation: `${Math.floor(Math.random() * 90)}deg`,
          delay: `${Math.floor(Math.random() * 40)}ms`,
        };
      });

      setParticles((current) => [...current, ...nextParticles]);

      const timeoutId = window.setTimeout(() => {
        setParticles((current) => current.filter((particle) => !nextParticles.some((next) => next.id === particle.id)));
        timeouts.current.delete(timeoutId);
      }, duration + 80);

      timeouts.current.add(timeoutId);
    };

    window.addEventListener('click', spawnBurst);

    return () => {
      window.removeEventListener('click', spawnBurst);
      timeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.current.clear();
    };
  }, []);

  return (
    <div className="pixel-click-layer" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="pixel-click-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 10px ${particle.color}, 0 0 18px ${particle.color}`,
            '--pixel-dx': `${particle.dx}px`,
            '--pixel-dy': `${particle.dy}px`,
            '--pixel-rotation': particle.rotation,
            '--pixel-duration': `${particle.duration}ms`,
            '--pixel-delay': particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export default PixelClickEffect;
