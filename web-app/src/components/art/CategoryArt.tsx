import type { ReactElement } from 'react';
import { DialectId } from '../../types';

/**
 * Category art: a round sticker for tiles and lists, and a wide animated
 * scene for each category's banner. Each category is its own little place:
 * an ahwa, a food stall, the sights, a taxi at dusk, a passing train, a
 * market scale, a pharmacy.
 */

export function CategorySticker({ category, className = '' }: { category: string; className?: string }) {
  const art: Record<string, ReactElement> = {
    conversation: (
      <>
        <circle cx="24" cy="24" r="22" fill="#ffe2c7" />
        <path d="M14 22h18v6a9 9 0 0 1-18 0z" fill="#e2785a" />
        <path d="M32 23h3a3 3 0 0 1 0 6h-3" stroke="#e2785a" strokeWidth="2.5" fill="none" />
        <path d="M19 12q-2 3 0 6M24 11q-2 3 0 6" stroke="#b9876a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <rect x="12" y="36" width="24" height="3" rx="1.5" fill="#c46a4c" />
      </>
    ),
    restaurants: (
      <>
        <circle cx="24" cy="24" r="22" fill="#fff0c2" />
        <ellipse cx="24" cy="30" rx="14" ry="6" fill="#f2b33d" />
        <circle cx="19" cy="26" r="3.5" fill="#7a5a2a" />
        <circle cx="27" cy="25" r="3.5" fill="#7a5a2a" />
        <circle cx="23" cy="21" r="3.5" fill="#8a6a35" />
        <path d="M15 29q9 4 18 0" stroke="#5aa35a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    ),
    tourism: (
      <>
        <circle cx="24" cy="24" r="22" fill="#dcefff" />
        <path d="M8 36L20 16l12 20z" fill="#e8b45a" />
        <path d="M20 16l12 20h-6z" fill="#c9923e" />
        <path d="M24 36l9-14 9 14z" fill="#f2c66d" />
        <circle cx="36" cy="12" r="4" fill="#f2b33d" />
      </>
    ),
    taxis: (
      <>
        <circle cx="24" cy="24" r="22" fill="#fff3b0" />
        <rect x="9" y="22" width="30" height="11" rx="4" fill="#f2c522" />
        <path d="M14 22l4-7h12l4 7z" fill="#f2c522" />
        <path d="M17 21l3-5h8l3 5z" fill="#bfe6ff" />
        <circle cx="16" cy="34" r="3.5" fill="#3a2a20" />
        <circle cx="32" cy="34" r="3.5" fill="#3a2a20" />
        <rect x="20" y="11" width="8" height="4" rx="1" fill="#3a2a20" />
      </>
    ),
    travel: (
      <>
        <circle cx="24" cy="24" r="22" fill="#ece7ff" />
        <rect x="10" y="17" width="28" height="15" rx="4" fill="#7d6ad6" />
        <rect x="13" y="20" width="6" height="5" rx="1" fill="#ece7ff" />
        <rect x="21" y="20" width="6" height="5" rx="1" fill="#ece7ff" />
        <rect x="29" y="20" width="6" height="5" rx="1" fill="#ece7ff" />
        <circle cx="16" cy="34" r="3" fill="#3a2a20" />
        <circle cx="32" cy="34" r="3" fill="#3a2a20" />
      </>
    ),
    numbers: (
      <>
        <circle cx="24" cy="24" r="22" fill="#ffe3ef" />
        <text x="24" y="31" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="19" fill="#d65a8f">
          ١٢٣
        </text>
      </>
    ),
    emergencies: (
      <>
        <circle cx="24" cy="24" r="22" fill="#ffe3e1" />
        <rect x="12" y="16" width="24" height="20" rx="5" fill="#ffffff" stroke="#e24a4a" strokeWidth="2.5" />
        <rect x="21.5" y="19.5" width="5" height="13" rx="1.5" fill="#e24a4a" />
        <rect x="17.5" y="23.5" width="13" height="5" rx="1.5" fill="#e24a4a" />
        <path d="M19 16v-3h10v3" stroke="#e24a4a" strokeWidth="2.5" fill="none" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 48 48" className={`sticker ${className}`} aria-hidden="true">
      {art[category] ?? art.conversation}
    </svg>
  );
}

/** Wide animated banner art for a category page. */
export function CategoryScene({
  category,
  dialect,
  className = '',
}: {
  category: string;
  dialect: DialectId;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {SCENES[category]?.(dialect) ?? SCENES.conversation(dialect)}
    </svg>
  );
}

const Steam = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => (
  <path
    className="anim-steam"
    style={{ animationDelay: `${delay}s` }}
    d={`M${x} ${y} q-4 -6 0 -12 q4 -6 0 -12`}
    stroke="#fff"
    strokeWidth="2.5"
    fill="none"
    strokeLinecap="round"
    opacity="0.8"
  />
);

const SCENES: Record<string, (d: DialectId) => ReactElement> = {
  // An ahwa: arched window at dusk, a lamp, two glasses of tea steaming.
  conversation: () => (
    <>
      <rect width="360" height="150" fill="#ffd9b5" />
      <path d="M40 150V60a40 40 0 0 1 80 0v90z" fill="#6b3f6e" />
      <path d="M48 150V62a32 32 0 0 1 64 0v88z" fill="#e2785a" opacity="0.55" />
      <circle cx="96" cy="70" r="7" fill="#ffe9b0" />
      <path d="M240 150V60a40 40 0 0 1 80 0v90z" fill="#6b3f6e" />
      <path d="M248 150V62a32 32 0 0 1 64 0v88z" fill="#e2785a" opacity="0.55" />
      <g className="anim-sway" style={{ transformOrigin: '180px 0px' }}>
        <line x1="180" y1="0" x2="180" y2="26" stroke="#9a3c2a" strokeWidth="2" />
        <circle className="anim-glow" cx="180" cy="44" r="20" fill="#ffcf6b" opacity="0.4" />
        <path d="M170 28h20l6 10-3 18h-26l-3-18z" fill="#c8743a" />
        <rect x="175" y="34" width="10" height="16" rx="4" fill="#ffd98a" />
      </g>
      <rect x="110" y="118" width="140" height="10" rx="4" fill="#9a5a2a" />
      <rect x="120" y="128" width="8" height="22" fill="#7a3e1c" />
      <rect x="232" y="128" width="8" height="22" fill="#7a3e1c" />
      <ellipse cx="180" cy="117" rx="50" ry="5" fill="#c8a06a" />
      <path d="M150 96h16l-2 20h-12z" fill="#fff" opacity="0.85" />
      <path d="M151 104h14l-1 12h-12z" fill="#b5501f" />
      <path d="M194 96h16l-2 20h-12z" fill="#fff" opacity="0.85" />
      <path d="M195 104h14l-1 12h-12z" fill="#b5501f" />
      <Steam x={158} y={92} />
      <Steam x={202} y={92} delay={0.9} />
    </>
  ),

  // A food cart with a striped awning and a steaming pot of ful.
  restaurants: () => (
    <>
      <rect width="360" height="150" fill="#fff1c8" />
      <circle cx="300" cy="34" r="18" fill="#ffd166" className="anim-pulse" />
      <rect x="0" y="134" width="360" height="16" fill="#e8c58a" />
      <path d="M90 44h180l-12 26H102z" fill="#d9930f" />
      <path d="M102 44h18l-4 26h-14zM138 44h18l-2 26h-16zM174 44h18v26h-18zM210 44h18l2 26h-16zM246 44h18l2 26h-14z" fill="#fff6e0" />
      <rect x="104" y="70" width="6" height="40" fill="#7a5208" />
      <rect x="250" y="70" width="6" height="40" fill="#7a5208" />
      <rect x="96" y="108" width="168" height="30" rx="6" fill="#c46a2a" />
      <circle cx="120" cy="140" r="8" fill="#3a2a20" />
      <circle cx="240" cy="140" r="8" fill="#3a2a20" />
      <path d="M150 108v-14a16 6 0 0 1 32 0v14z" fill="#8a8a96" />
      <ellipse cx="166" cy="94" rx="16" ry="5" fill="#a8a8b4" />
      <Steam x={160} y={86} />
      <Steam x={172} y={86} delay={0.7} />
      <ellipse cx="216" cy="106" rx="18" ry="4" fill="#fff" />
      <circle cx="208" cy="102" r="5" fill="#7a5a2a" />
      <circle cx="218" cy="100" r="5" fill="#8a6a35" />
      <circle cx="226" cy="103" r="5" fill="#7a5a2a" />
    </>
  ),

  // Pyramids and a camel for Cairo; the Treasury at Petra for Jordan.
  tourism: (d) =>
    d === 'levantine' ? (
      <>
        <rect width="360" height="150" fill="#ffd9c4" />
        <path d="M0 150V30q60-40 120-10t120 0 120 10v120z" fill="#d98a6a" />
        <path d="M110 150V40h140v110z" fill="#e8a27e" />
        <path d="M120 70h120l-10-16H130z" fill="#c9714f" />
        <rect x="130" y="70" width="10" height="80" fill="#c9714f" />
        <rect x="160" y="70" width="10" height="80" fill="#c9714f" />
        <rect x="190" y="70" width="10" height="80" fill="#c9714f" />
        <rect x="220" y="70" width="10" height="80" fill="#c9714f" />
        <path d="M168 54v-14h24v14" fill="#c9714f" />
        <path d="M176 40l4-10 4 10z" fill="#c9714f" />
        <rect x="170" y="110" width="20" height="40" rx="10" fill="#7a3a2a" />
        <g className="anim-walk">
          <Camel />
        </g>
      </>
    ) : (
      <>
        <rect width="360" height="150" fill="#dcefff" />
        <circle cx="300" cy="34" r="16" fill="#ffd166" className="anim-pulse" />
        <path d="M40 130L110 46l70 84z" fill="#e8b45a" />
        <path d="M110 46l70 84h-24z" fill="#c9923e" />
        <path d="M150 130l60-72 60 72z" fill="#f2c66d" />
        <path d="M210 58l60 72h-20z" fill="#d6a24c" />
        <path d="M250 130l34-40 34 40z" fill="#e8b45a" />
        <rect y="128" width="360" height="22" fill="#f2d49a" />
        <g className="anim-walk">
          <Camel />
        </g>
      </>
    ),

  // A street at dusk; a taxi drives by (Cairo: white with a checker band;
  // Amman: yellow).
  taxis: (d) => {
    const body = d === 'levantine' ? '#f2c522' : '#ffffff';
    return (
      <>
        <rect width="360" height="150" fill="#3f3a6b" />
        <rect width="360" height="90" fill="#5b4b8a" />
        <circle cx="60" cy="30" r="2" fill="#fff" className="anim-twinkle" />
        <circle cx="200" cy="20" r="2" fill="#fff" className="anim-twinkle" style={{ animationDelay: '1s' }} />
        <path d="M0 110V70h40V50h30v60zM90 110V60h50v50zM160 110V40h36v70zM210 110V66h60v44zM290 110V52h40v58z" fill="#2c2550" />
        <rect x="100" y="70" width="8" height="8" fill="#ffd98a" />
        <rect x="170" y="54" width="8" height="8" fill="#ffd98a" />
        <rect x="300" y="64" width="8" height="8" fill="#ffd98a" />
        <rect y="110" width="360" height="40" fill="#4a4a5a" />
        <path d="M0 130h360" stroke="#f2c522" strokeWidth="3" strokeDasharray="18 14" />
        <g>
          <line x1="250" y1="110" x2="250" y2="56" stroke="#2c2550" strokeWidth="4" />
          <circle cx="250" cy="54" r="6" fill="#ffe08a" />
          <circle className="anim-glow" cx="250" cy="54" r="18" fill="#ffe08a" opacity="0.3" />
        </g>
        <g className="anim-drive">
          <rect x="0" y="100" width="76" height="22" rx="7" fill={body} />
          <path d="M14 100l10-14h28l10 14z" fill={body} />
          <path d="M20 99l7-10h22l7 10z" fill="#bfe6ff" />
          {d === 'levantine' ? null : <path d="M2 108h72" stroke="#222" strokeWidth="4" strokeDasharray="4 4" />}
          <rect x="30" y="80" width="16" height="6" rx="2" fill="#3a2a20" />
          <circle cx="18" cy="124" r="8" fill="#222" />
          <circle cx="58" cy="124" r="8" fill="#222" />
          <circle cx="74" cy="110" r="3" fill="#ffe08a" />
        </g>
      </>
    );
  },

  // Rolling hills and a little train puffing past.
  travel: () => (
    <>
      <rect width="360" height="150" fill="#ece7ff" />
      <circle cx="60" cy="36" r="14" fill="#ffd166" className="anim-pulse" />
      <path d="M0 120q60-50 120-10t120-20 120 10v50H0z" fill="#b9e3b0" />
      <path d="M0 132q90-30 180 0t180 0v18H0z" fill="#8fcf88" />
      <rect y="128" width="360" height="4" fill="#7a5a3a" />
      <g className="anim-drive" style={{ animationDuration: '9s' }}>
        <rect x="0" y="104" width="40" height="22" rx="5" fill="#a99bf0" />
        <rect x="44" y="104" width="40" height="22" rx="5" fill="#a99bf0" />
        <rect x="88" y="100" width="40" height="26" rx="5" fill="#7d6ad6" />
        <path d="M128 112l10 14h-10z" fill="#45389a" />
        <rect x="114" y="92" width="10" height="10" fill="#45389a" />
        <rect x="6" y="108" width="10" height="8" rx="2" fill="#fff" />
        <rect x="22" y="108" width="10" height="8" rx="2" fill="#fff" />
        <rect x="50" y="108" width="10" height="8" rx="2" fill="#fff" />
        <rect x="66" y="108" width="10" height="8" rx="2" fill="#fff" />
        <rect x="94" y="106" width="12" height="9" rx="2" fill="#ffe08a" />
        {[8, 32, 52, 76, 96, 120].map((x) => (
          <circle key={x} cx={x} cy="128" r="4" fill="#3a2a20" />
        ))}
        <circle className="anim-steam" cx="119" cy="86" r="5" fill="#fff" />
        <circle className="anim-steam" style={{ animationDelay: '0.7s' }} cx="115" cy="80" r="4" fill="#fff" />
      </g>
    </>
  ),

  // A market scale gently tipping, with numerals floating up.
  numbers: () => (
    <>
      <rect width="360" height="150" fill="#ffe3ef" />
      {[
        ['١', 40, 0],
        ['٢', 90, 1],
        ['٣', 270, 0.5],
        ['٥', 320, 1.6],
        ['١٠', 230, 2.2],
      ].map(([n, x, delay]) => (
        <text
          key={String(n)}
          x={Number(x)}
          y="60"
          className="anim-float"
          style={{ animationDelay: `${delay}s` }}
          fontFamily="Fredoka, sans-serif"
          fontWeight="700"
          fontSize="26"
          fill="#d65a8f"
          opacity="0.45"
        >
          {n}
        </text>
      ))}
      <rect y="136" width="360" height="14" fill="#f2b6cf" />
      <rect x="174" y="60" width="12" height="76" rx="3" fill="#8a2c57" />
      <rect x="150" y="128" width="60" height="10" rx="4" fill="#8a2c57" />
      <g className="anim-tip" style={{ transformOrigin: '180px 60px' }}>
        <rect x="110" y="56" width="140" height="8" rx="4" fill="#b34a7a" />
        <line x1="120" y1="60" x2="120" y2="90" stroke="#b34a7a" strokeWidth="2" />
        <line x1="240" y1="60" x2="240" y2="90" stroke="#b34a7a" strokeWidth="2" />
        <path d="M100 90h40a20 10 0 0 1-40 0z" fill="#f590bd" />
        <path d="M220 90h40a20 10 0 0 1-40 0z" fill="#f590bd" />
        <circle cx="114" cy="86" r="6" fill="#ffd166" />
        <circle cx="126" cy="86" r="6" fill="#ffd166" />
        <circle cx="240" cy="84" r="8" fill="#ff8a65" />
      </g>
      <circle cx="180" cy="56" r="7" fill="#8a2c57" />
    </>
  ),

  // A friendly pharmacy with a pulsing green cross.
  emergencies: () => (
    <>
      <rect width="360" height="150" fill="#e2f6ee" />
      <rect x="90" y="40" width="180" height="110" rx="8" fill="#ffffff" />
      <rect x="90" y="40" width="180" height="22" rx="8" fill="#d94a4a" />
      <text x="180" y="56" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="600" fontSize="12" fill="#fff">
        صيدلية · PHARMACY
      </text>
      <g className="anim-pulse" style={{ transformOrigin: '140px 96px' }}>
        <rect x="130" y="80" width="20" height="32" rx="3" fill="#2fb36f" />
        <rect x="124" y="86" width="32" height="20" rx="3" fill="#2fb36f" />
      </g>
      <rect x="190" y="78" width="60" height="72" rx="4" fill="#cfe9ff" />
      <line x1="220" y1="78" x2="220" y2="150" stroke="#9ccaf0" strokeWidth="2" />
      <path d="M298 104c-6-8-18-4-18 6 0 8 18 18 18 18s18-10 18-18c0-10-12-14-18-6z" fill="#ff7a8a" className="anim-float" />
      <rect y="140" width="360" height="10" fill="#b8dfcf" />
    </>
  ),
};

function Camel() {
  // Drawn facing right; mirrored so it faces the way it walks (leftwards).
  return (
    <g transform="matrix(-1 0 0 1 70 0)">
      <ellipse cx="30" cy="112" rx="20" ry="10" fill="#c98a4a" />
      <ellipse cx="26" cy="102" rx="9" ry="7" fill="#c98a4a" />
      <path d="M48 108q8-14 6-22h6q2 8-4 24z" fill="#c98a4a" />
      <ellipse cx="60" cy="86" rx="6" ry="4" fill="#c98a4a" />
      <rect x="16" y="118" width="4" height="14" fill="#a86a32" />
      <rect x="40" y="118" width="4" height="14" fill="#a86a32" />
      <rect x="22" y="94" width="10" height="6" rx="2" fill="#d94a4a" />
    </g>
  );
}
