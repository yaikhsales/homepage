/* The three flags the public event page offers. Same artwork as the
 * homepage's language buttons. */

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r / 2.5;
    return `${cx + rr * Math.cos(angle)},${cy + rr * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill="#FFDE00" />;
}

export function FlagKH() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/images/flag-kh.png" alt="" className="h-full w-full object-cover" draggable={false} />;
}

export function FlagGB() {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full">
      <defs><clipPath id="ev-gb"><circle cx="30" cy="30" r="30" /></clipPath></defs>
      <g clipPath="url(#ev-gb)">
        <rect width="60" height="60" fill="#012169" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="10" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V60 M0,30 H60" stroke="#fff" strokeWidth="14" />
        <path d="M30,0 V60 M0,30 H60" stroke="#C8102E" strokeWidth="8" />
      </g>
    </svg>
  );
}

export function FlagCN() {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full">
      <defs><clipPath id="ev-cn"><circle cx="30" cy="30" r="30" /></clipPath></defs>
      <g clipPath="url(#ev-cn)">
        <rect width="60" height="60" fill="#DE2910" />
        <Star cx={15} cy={15} r={6} />
        <Star cx={26} cy={8} r={2.2} />
        <Star cx={31} cy={14} r={2.2} />
        <Star cx={31} cy={22} r={2.2} />
        <Star cx={26} cy={28} r={2.2} />
      </g>
    </svg>
  );
}
