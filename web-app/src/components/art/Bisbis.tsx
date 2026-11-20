/**
 * Bisbis (بسبس — what Egyptians call a street cat): the app's guide.
 *
 * Sits on the souk awning on Home, peeks over every phrase sheet, naps on an
 * empty Saved tab. Her mouth moves while a recording plays (`talking`), she
 * blinks and twitches an ear on her own. All motion is CSS (index.css) so it
 * switches off with the user's reduced-motion setting.
 */

interface BisbisProps {
  pose?: 'sit' | 'peek' | 'nap';
  talking?: boolean;
  className?: string;
}

const FUR = '#f6b46e';
const FUR_DARK = '#e08a3e';
const CREAM = '#ffe3c4';
const EAR = '#ffb7c9';

export function Bisbis({ pose = 'sit', talking = false, className = '' }: BisbisProps) {
  const cls = `${talking ? 'is-talking' : ''} ${className}`;

  if (pose === 'peek') {
    return (
      <svg viewBox="0 0 120 80" className={cls} aria-hidden="true">
        <path className="anim-twitch" d="M22 40 L18 6 L46 26 Z" fill={FUR} />
        <path d="M24 33 L22 15 L39 27 Z" fill={EAR} />
        <path className="anim-twitch" style={{ animationDelay: '1.5s' }} d="M98 40 L102 6 L74 26 Z" fill={FUR} />
        <path d="M96 33 L98 15 L81 27 Z" fill={EAR} />
        <ellipse cx="60" cy="62" rx="46" ry="38" fill={FUR} />
        <path d="M50 30q10 5 20 0" stroke={FUR_DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
        <Eyes y={56} lx={44} rx={76} r={6} />
        <ellipse cx="32" cy="68" rx="7" ry="4" fill="#ff9fb8" opacity="0.6" />
        <ellipse cx="88" cy="68" rx="7" ry="4" fill="#ff9fb8" opacity="0.6" />
        <path d="M56 66 l4 4 4-4z" fill="#d8607f" />
        <ellipse className="cat-mouth" cx="60" cy="74" rx="4" ry="2.5" fill="#7a2f45" />
        <ellipse className="anim-paw" cx="14" cy="76" rx="11" ry="9" fill={CREAM} />
        <ellipse cx="106" cy="78" rx="11" ry="8" fill={CREAM} />
      </svg>
    );
  }

  if (pose === 'nap') {
    return (
      <svg viewBox="0 0 200 130" className={cls} aria-hidden="true">
        <ellipse cx="100" cy="118" rx="80" ry="8" fill="currentColor" opacity="0.08" />
        <path d="M168 96 q22 6 14 22 q-8 10 -40 2" stroke={FUR} strokeWidth="12" fill="none" strokeLinecap="round" />
        <ellipse cx="110" cy="92" rx="66" ry="30" fill={FUR} />
        <path d="M80 70q14 6 28 0M120 66q12 6 24 0" stroke={FUR_DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M36 74 L34 46 L56 62 Z" fill={FUR} />
        <path d="M78 70 L84 44 L62 58 Z" fill={FUR} />
        <ellipse cx="56" cy="88" rx="32" ry="26" fill={FUR} />
        <path d="M42 86q5 4 10 0M62 86q5 4 10 0" stroke="#3a2430" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M54 94 l3 3 3-3z" fill="#d8607f" />
        <ellipse cx="60" cy="112" rx="14" ry="6" fill={CREAM} />
        <g className="anim-rise" fill="currentColor" opacity="0.5" fontFamily="Fredoka, sans-serif" fontWeight="600">
          <text x="92" y="44" fontSize="16">z</text>
        </g>
        <g className="anim-rise" style={{ animationDelay: '1.3s' }} fill="currentColor" opacity="0.5" fontFamily="Fredoka, sans-serif" fontWeight="600">
          <text x="104" y="40" fontSize="12">z</text>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 178" className={cls} aria-hidden="true">
      <path className="anim-tail" d="M150 150 q40 -10 34 -50 q-4 -22 -18 -18" stroke="#f0a35e" strokeWidth="12" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="140" rx="54" ry="34" fill={FUR} />
      <ellipse cx="100" cy="150" rx="30" ry="20" fill={CREAM} />
      <path className="anim-twitch" d="M58 48 L52 10 L84 32 Z" fill={FUR} />
      <path d="M60 40 L57 20 L76 33 Z" fill={EAR} />
      <path className="anim-twitch" style={{ animationDelay: '1.5s' }} d="M142 48 L148 10 L116 32 Z" fill={FUR} />
      <path d="M140 40 L143 20 L124 33 Z" fill={EAR} />
      <ellipse cx="100" cy="68" rx="50" ry="42" fill={FUR} />
      <path d="M88 30q12 6 24 0M84 38q16 8 32 0" stroke={FUR_DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <Eyes y={66} lx={82} rx={118} r={7} />
      <ellipse cx="70" cy="82" rx="8" ry="5" fill="#ff9fb8" opacity="0.6" />
      <ellipse cx="130" cy="82" rx="8" ry="5" fill="#ff9fb8" opacity="0.6" />
      <path d="M96 78 l4 4 4-4z" fill="#d8607f" />
      <ellipse className="cat-mouth" cx="100" cy="88" rx="5" ry="3" fill="#7a2f45" />
      <path d="M60 80h-20M60 86l-18 4M140 80h20M140 86l18 4" stroke="#c98a5a" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="78" cy="172" rx="12" ry="6" fill={CREAM} />
      <ellipse cx="122" cy="172" rx="12" ry="6" fill={CREAM} />
    </svg>
  );
}

function Eyes({ y, lx, rx, r }: { y: number; lx: number; rx: number; r: number }) {
  return (
    <>
      <ellipse cx={lx} cy={y} rx={r} ry={r * 1.28} fill="#3a2430" />
      <ellipse cx={rx} cy={y} rx={r} ry={r * 1.28} fill="#3a2430" />
      <circle cx={lx + 2} cy={y - 4} r={r * 0.36} fill="#fff" />
      <circle cx={rx + 2} cy={y - 4} r={r * 0.36} fill="#fff" />
      <ellipse className="anim-blink" cx={lx} cy={y} rx={r + 1} ry={r * 1.28 + 1} fill={FUR} />
      <ellipse className="anim-blink" cx={rx} cy={y} rx={r + 1} ry={r * 1.28 + 1} fill={FUR} />
    </>
  );
}
