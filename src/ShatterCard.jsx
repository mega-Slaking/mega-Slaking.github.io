import { useState, useRef, useCallback } from 'react';

const COLS = 4;
const ROWS = 4;

function buildFragments(cols, rows) {
  // Build a grid of polygon fragments with jittered interior nodes
  const pts = Array.from({ length: rows + 1 }, (_, r) =>
    Array.from({ length: cols + 1 }, (_, c) => {
      const x = (c / cols) * 100;
      const y = (r / rows) * 100;
      const jx = c > 0 && c < cols ? (Math.random() - 0.5) * 14 : 0;
      const jy = r > 0 && r < rows ? (Math.random() - 0.5) * 14 : 0;
      return { x: x + jx, y: y + jy };
    })
  );
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const tl = pts[r][c], tr = pts[r][c + 1];
      const br = pts[r + 1][c + 1], bl = pts[r + 1][c];
      return {
        id: r * cols + c,
        polygon: `${tl.x}% ${tl.y}%, ${tr.x}% ${tr.y}%, ${br.x}% ${br.y}%, ${bl.x}% ${bl.y}%`,
        cx: (tl.x + tr.x + br.x + bl.x) / 4,
        cy: (tl.y + tr.y + br.y + bl.y) / 4,
      };
    })
  ).flat();
}

function buildCracks(ox, oy, W, H, count = 11) {
  const maxLen = Math.sqrt(W * W + H * H);
  const lines = [];

  // Always send a crack toward each corner so the web spans the whole card,
  // no matter where on the card the origin sits. Lengths exceed the diagonal
  // (the SVG clips them to the card edge) so they reliably reach the border.
  const corners = [
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ];
  corners.forEach(([cx, cy], i) => {
    const angle = Math.atan2(cy - oy, cx - ox) + (Math.random() - 0.5) * 0.22;
    const len = maxLen * (1.1 + Math.random() * 0.2);
    lines.push({ x1: ox, y1: oy, x2: ox + Math.cos(angle) * len, y2: oy + Math.sin(angle) * len, id: `c${i}` });
  });

  // Dense radial cracks for the shattered-glass look
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const len = maxLen * (1.0 + Math.random() * 0.35);
    lines.push({
      x1: ox, y1: oy,
      x2: ox + Math.cos(angle) * len,
      y2: oy + Math.sin(angle) * len,
      id: `m${i}`,
    });
    // Branch crack from partway along each main crack
    if (Math.random() > 0.25) {
      const t = 0.3 + Math.random() * 0.45;
      const bx = ox + Math.cos(angle) * len * t;
      const by = oy + Math.sin(angle) * len * t;
      const ba = angle + (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.5);
      const bl = maxLen * (0.4 + Math.random() * 0.4);
      lines.push({ x1: bx, y1: by, x2: bx + Math.cos(ba) * bl, y2: by + Math.sin(ba) * bl, id: `b${i}` });
    }
  }
  return lines;
}

// Check once at module level — avoids re-querying on every render
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ShatterCard({ label, href, className = '' }) {
  const [phase, setPhase] = useState('idle'); // idle | hover | shatter | exploding
  const [cracks, setCracks] = useState([]);
  const [fragments, setFragments] = useState([]);
  const [fragVelocities, setFragVelocities] = useState({});
  const cardRef = useRef(null);

  const getSize = () => {
    const el = cardRef.current;
    return el ? { W: el.clientWidth, H: el.clientHeight } : { W: 300, H: 180 };
  };

  const handleMouseEnter = useCallback(
    (e) => {
      if (prefersReducedMotion || phase === 'shatter' || phase === 'exploding') return;
      const rect = cardRef.current.getBoundingClientRect();
      const { W, H } = getSize();
      setCracks(buildCracks(e.clientX - rect.left, e.clientY - rect.top, W, H));
      setPhase('hover');
    },
    [phase]
  );

  const handleMouseLeave = useCallback(() => {
    if (phase === 'hover') setPhase('idle');
  }, [phase]);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (prefersReducedMotion) {
        window.location.hash = href;
        return;
      }
      if (phase === 'shatter' || phase === 'exploding') return;

      const rect = cardRef.current.getBoundingClientRect();
      const { W, H } = getSize();
      const ox = e.clientX - rect.left;
      const oy = e.clientY - rect.top;

      const frags = buildFragments(COLS, ROWS);
      const vels = {};
      frags.forEach((f) => {
        const dx = f.cx - (ox / W) * 100;
        const dy = f.cy - (oy / H) * 100;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const speed = 220 + Math.random() * 240;
        vels[f.id] = {
          tx: (dx / dist) * speed,
          ty: (dy / dist) * speed + 35, // slight gravity drift
          tz: 90 + Math.random() * 320, // pop toward the viewer for depth
          rx: (Math.random() - 0.5) * 220, // tumble in 3D
          ry: (Math.random() - 0.5) * 220,
          rot: (Math.random() - 0.5) * 160,
          scale: 1.1 + Math.random() * 0.7,
          brightness: 1.35 + Math.random() * 0.5,
          delay: Math.random() * 70,
        };
      });

      setCracks(buildCracks(ox, oy, W, H, 13));
      setFragments(frags);
      setFragVelocities(vels);
      setPhase('shatter');

      // Let fragments mount at rest for one painted frame before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('exploding'));
      });

      setTimeout(() => {
        window.location.hash = href;
      }, 1150);
    },
    [phase, href]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleClick(e);
    },
    [handleClick]
  );

  const isHover = phase === 'hover';
  const isShattering = phase === 'shatter' || phase === 'exploding';
  const isExploding = phase === 'exploding';

  return (
    <div
      ref={cardRef}
      className={[
        'shatter-card',
        isHover && 'shatter-card--hover',
        isShattering && 'shatter-card--shatter',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={label}
    >
      {/* SVG crack overlay — visible on hover and during shatter */}
      {(isHover || isShattering) && (
        <svg
          className="shatter-card__cracks"
          aria-hidden="true"
          width="100%"
          height="100%"
          overflow="hidden"
        >
          {cracks.map((c, idx) => (
            <line
              key={c.id}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              style={{ animationDelay: `${idx * 18}ms` }}
            />
          ))}
        </svg>
      )}

      {/* Fragment layer — only during shatter sequence */}
      {isShattering &&
        fragments.map((f) => {
          const v = fragVelocities[f.id] || {};
          return (
            <div
              key={f.id}
              className="shatter-fragment"
              style={{
                clipPath: `polygon(${f.polygon})`,
                transform: isExploding
                  ? `translate3d(${v.tx ?? 0}px, ${v.ty ?? 0}px, ${v.tz ?? 0}px) rotateX(${v.rx ?? 0}deg) rotateY(${v.ry ?? 0}deg) rotateZ(${v.rot ?? 0}deg) scale(${v.scale ?? 1})`
                  : 'none',
                filter: isExploding
                  ? `brightness(${v.brightness ?? 1.3}) blur(0.6px)`
                  : 'none',
                opacity: isExploding ? 0 : 1,
                transitionDelay: `${v.delay ?? 0}ms`,
              }}
            />
          );
        })}

      <span
        className="shatter-card__label"
        style={{ opacity: isShattering ? 0 : 1 }}
      >
        {label}
      </span>
    </div>
  );
}
