"use client";

/* Tech-stack icon set — small inline SVGs, currentColor so they inherit the layer color */
const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icon = {
  chip: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" />
      <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3" />
      <path d="M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 4a2.6 2.6 0 00-2.6 2.6c-1.4 0-2.4 1-2.4 2.4 0 1 .6 1.9 1.5 2.3-.3.5-.5 1-.5 1.6a2.5 2.5 0 002.5 2.5v.6A2.6 2.6 0 009 19V4z" />
      <path d="M15 4a2.6 2.6 0 012.6 2.6c1.4 0 2.4 1 2.4 2.4 0 1-.6 1.9-1.5 2.3.3.5.5 1 .5 1.6a2.5 2.5 0 01-2.5 2.5v.6A2.6 2.6 0 0115 19V4z" />
      <line x1="12" y1="4" x2="12" y2="21" />
    </svg>
  ),
  solar: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="5" r="1.6" />
      <path d="M12 1.5v1M12 7v1M16 5h1.5M6.5 5H8M14.8 2.2l-.7.7M9.9 7.1l-.7.7M14.8 7.8l-.7-.7M9.9 2.9l-.7-.7" />
      <rect x="4" y="11" width="16" height="9" rx="0.8" />
      <path d="M4 14.5h16M4 17.5h16M9 11v9M14 11v9" />
    </svg>
  ),
  mesh: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="6" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <circle cx="12" cy="14" r="1.4" />
      <path d="M12 7.5L6 16.5M12 7.5l6 9M6.5 17.5h11M12 7.5v5" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M7 13l3-3 3 2 4-5" />
      <path d="M3 21h18" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <line x1="12" y1="13" x2="12" y2="21" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M7 18a5 5 0 010-10 6 6 0 0111-1 4.5 4.5 0 010 9z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 16l-5-4 5-4M15 8l5 4-5 4M14 4l-4 16" />
    </svg>
  ),
  db: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  android: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="5" y="8" width="14" height="11" rx="2" />
      <line x1="3" y1="11" x2="3" y2="16" />
      <line x1="21" y1="11" x2="21" y2="16" />
      <line x1="9" y1="19" x2="9" y2="22" />
      <line x1="15" y1="19" x2="15" y2="22" />
      <path d="M8 8l-2-3M16 8l2-3" />
      <circle cx="9.5" cy="12" r="0.7" fill="currentColor" />
      <circle cx="14.5" cy="12" r="0.7" fill="currentColor" />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M16 12c0-2 1.5-3 2-3.5-1-1.5-2.5-2-3.5-2-1.5 0-2.5 1-3 1-.5 0-1.5-1-3-1-1.5 0-3 .5-4 2-1.5 2.5-.5 6 1 8 1 1 2 2 3 2s1.5-.5 3-.5 2 .5 3 .5 2-1 2.5-2c-1-.5-1-2-1-4.5z" />
      <path d="M13 4.5c.5-1 1.5-1.5 2.5-1.5 0 1-.5 2-1.5 2.5-.5 1-1.5 1.5-2 1.5 0-1 .5-2 1-2.5z" />
    </svg>
  ),
  sensor: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M8 8a6 6 0 010 8M5 5a10 10 0 010 14M16 8a6 6 0 010 8M19 5a10 10 0 010 14" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M20 13l-7 7-9-9V3h8z" />
      <circle cx="7.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  finger: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M6 11a6 6 0 0112 0v3a6 6 0 01-1.5 4" />
      <path d="M9 12v3a3 3 0 003 3" />
      <path d="M12 9v6" />
      <path d="M5 14c0 3 1 5 2 6" />
      <path d="M19 14c0 3-1 5-2 6" />
    </svg>
  ),
  bank: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3 9l9-5 9 5" />
      <path d="M5 9v9M9 9v9M15 9v9M19 9v9" />
      <path d="M3 21h18" />
    </svg>
  ),
  paper: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <path d="M14 3v6h6"/>
      <path d="M9 13h6M9 17h6"/>
    </svg>
  ),
  books: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 19V5a2 2 0 0 1 2-2h10v18H6a2 2 0 0 1-2-2z"/>
      <path d="M16 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"/>
      <path d="M8 7h6M8 11h6M8 15h4"/>
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 19l7-7 3 3-7 7-3-3z"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/>
      <path d="M2 2l7.586 7.586"/>
      <circle cx="11" cy="11" r="2"/>
    </svg>
  ),
  running: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="13" cy="4" r="2"/>
      <path d="M4 22l5-7 3 3 5-2 3 4"/>
      <path d="M9 11l3-3 4 1 1 5-3 3-3-2-2 4"/>
    </svg>
  ),
  spreadsheet: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
};

type Chip = { icon: React.ReactNode; label: string; brand?: string };

function ChipGrid({ items, accent }: { items: Chip[]; accent: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1 px-1.5 py-2 rounded-lg bg-white/12 border border-white/25 backdrop-blur-sm"
        >
          <div className={accent}>{it.icon}</div>
          <div className="text-[9.5px] font-bold text-center leading-tight">{it.label}</div>
          {it.brand && <div className="text-[7.5px] uppercase tracking-wider opacity-70">{it.brand}</div>}
        </div>
      ))}
    </div>
  );
}

function ChipGridLight({ items }: { items: Chip[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1 px-1.5 py-2 rounded-lg bg-white border border-yai-orange/30"
        >
          <div className="text-yai-orange w-6 h-6">{it.icon}</div>
          <div className="text-[9.5px] font-bold text-yai-navy text-center leading-tight">{it.label}</div>
          {it.brand && <div className="text-[7.5px] uppercase tracking-wider text-gray-500">{it.brand}</div>}
        </div>
      ))}
    </div>
  );
}

export function TechStackLayers() {
  // Layer 3 — Full Ai compute (Western first, then Chinese)
  const layer3: Chip[] = [
    { icon: <span className="block w-7 h-7">{Icon.chip}</span>,  label: "NVIDIA",   brand: "GPU" },
    { icon: <span className="block w-7 h-7">{Icon.chip}</span>,  label: "AMD",      brand: "GPU" },
    { icon: <span className="block w-7 h-7">{Icon.chip}</span>,  label: "Huawei",   brand: "Ascend" },
    { icon: <span className="block w-7 h-7">{Icon.brain}</span>, label: "Llama",    brand: "Meta" },
    { icon: <span className="block w-7 h-7">{Icon.brain}</span>, label: "Qwen",     brand: "Alibaba" },
    { icon: <span className="block w-7 h-7">{Icon.brain}</span>, label: "DeepSeek", brand: "open" },
    { icon: <span className="block w-7 h-7">{Icon.solar}</span>, label: "Solar",    brand: "mini DC" },
    { icon: <span className="block w-7 h-7">{Icon.mesh}</span>,  label: "Edge",     brand: "mesh" },
  ];

  // Layer 2 — Agentic stack
  const layer2: Chip[] = [
    { icon: <span className="block w-7 h-7">{Icon.brain}</span>,     label: "Claude",      brand: "Anthropic" },
    { icon: <span className="block w-7 h-7">{Icon.brain}</span>,     label: "GPT",         brand: "OpenAI" },
    { icon: <span className="block w-7 h-7">{Icon.brain}</span>,     label: "Gemini",      brand: "Google" },
    { icon: <span className="block w-7 h-7">{Icon.box}</span>,       label: "Open-source", brand: "self-host" },
    { icon: <span className="block w-7 h-7">{Icon.mic}</span>,       label: "Voice",       brand: "to workflow" },
    { icon: <span className="block w-7 h-7">{Icon.chat}</span>,      label: "Chat",        brand: "agent ops" },
    { icon: <span className="block w-7 h-7">{Icon.dashboard}</span>, label: "DTV",         brand: "twin view" },
    { icon: <span className="block w-7 h-7">{Icon.chat}</span>,      label: "EN · 中文 · ខ្មែរ", brand: "tri-lingual" },
  ];

  // Today — what Yai replaces (legacy/old stack)
  const today: Chip[] = [
    { icon: <span className="block w-7 h-7">{Icon.paper}</span>,       label: "Paper",      brand: "reports" },
    { icon: <span className="block w-7 h-7">{Icon.books}</span>,       label: "Ledgers",    brand: "books" },
    { icon: <span className="block w-7 h-7">{Icon.spreadsheet}</span>, label: "Excel",      brand: "scattered" },
    { icon: <span className="block w-7 h-7">{Icon.chat}</span>,        label: "WhatsApp",   brand: "chat chaos" },
    { icon: <span className="block w-7 h-7">{Icon.pen}</span>,         label: "Manual",     brand: "signing" },
    { icon: <span className="block w-7 h-7">{Icon.running}</span>,     label: "Chasing",    brand: "approvals" },
  ];

  // Layer 1 — Digitalization stack
  const layer1: Chip[] = [
    { icon: <span className="block w-7 h-7">{Icon.cloud}</span>,    label: "Cloud",     brand: "shared SaaS" },
    { icon: <span className="block w-7 h-7">{Icon.code}</span>,     label: "Laravel",   brand: "PHP" },
    { icon: <span className="block w-7 h-7">{Icon.db}</span>,       label: "MongoDB",   brand: "data" },
    { icon: <span className="block w-7 h-7">{Icon.android}</span>,  label: "Android",   brand: "native" },
    { icon: <span className="block w-7 h-7">{Icon.apple}</span>,    label: "iOS",       brand: "native" },
    { icon: <span className="block w-7 h-7">{Icon.sensor}</span>,   label: "AIoT",      brand: "sensors" },
    { icon: <span className="block w-7 h-7">{Icon.tag}</span>,      label: "RFID",      brand: "tracking" },
    { icon: <span className="block w-7 h-7">{Icon.finger}</span>,   label: "Biometric", brand: "attendance" },
    { icon: <span className="block w-7 h-7">{Icon.bank}</span>,     label: "ABA · Wing", brand: "payouts" },
  ];

  // 4 columns reading left → right: Today (old way) → Layer 1 → Layer 2 → Layer 3 Full Ai
  return (
    <div>
      {/* Evolution rail */}
      <div className="hidden md:flex items-center justify-center gap-3 mb-3 text-yai-blue/70 select-none">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Old way</span>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-yai-blue/40 to-yai-blue" />
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-yai-blue">Evolution →</span>
        <div className="flex-1 h-px bg-gradient-to-r from-yai-blue via-yai-blue/40 to-gray-300" />
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Full Ai</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Today — what Yai replaces (left-most) */}
        <div className="rounded-xl p-4 text-gray-600 border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col">
          <span className="self-start text-[9px] font-extrabold uppercase tracking-[0.18em] bg-gray-300 text-gray-700 px-2 py-0.5 rounded">Today</span>
          <div className="text-[10.5px] uppercase tracking-wider text-gray-500 mt-2">The old tech</div>
          <h3 className="text-sm font-bold text-gray-700 leading-tight mt-1">Paper · ledgers · scattered chat · manual signatures</h3>
          <div className="grid grid-cols-2 gap-2 mt-3 flex-1 content-start">
            {today.map((it, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg bg-white border border-dashed border-gray-300"
              >
                <div className="text-gray-400 w-6 h-6">{it.icon}</div>
                <div className="text-[9.5px] font-bold text-gray-700 text-center leading-tight">{it.label}</div>
                {it.brand && <div className="text-[7.5px] uppercase tracking-wider text-gray-400">{it.brand}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Layer 1 — Digitalization (orange) */}
        <div className="rounded-xl p-4 text-yai-navy border-2 border-yai-orange/40 flex flex-col" style={{ background: "linear-gradient(to bottom, #FFF1E0, #FFD9B5)" }}>
          <span className="self-start text-[9px] font-extrabold uppercase tracking-[0.18em] bg-yai-orange text-white px-2 py-0.5 rounded">Layer 1</span>
          <div className="text-[10.5px] uppercase tracking-wider text-yai-orange mt-2">The foundation</div>
          <h3 className="text-sm font-bold leading-tight mt-1">Cloud-first SaaS · mobile-native · AIoT-connected</h3>
          <div className="mt-3 flex-1">
            <ChipGridLight items={layer1} />
          </div>
        </div>

        {/* Layer 2 — Agentic (blue) */}
        <div className="rounded-xl p-4 text-white border-2 border-yai-blue flex flex-col" style={{ background: "linear-gradient(to bottom, #1E4DAA, #2A5DC4)" }}>
          <span className="self-start text-[9px] font-extrabold uppercase tracking-[0.18em] bg-white text-yai-blue px-2 py-0.5 rounded">Layer 2</span>
          <div className="text-[10.5px] uppercase tracking-wider opacity-80 mt-2">Model-agnostic</div>
          <h3 className="text-sm font-bold leading-tight mt-1">Swappable LLMs · voice + chat + dashboards</h3>
          <div className="mt-3 flex-1">
            <ChipGrid items={layer2} accent="text-amber-300 w-6 h-6" />
          </div>
        </div>

        {/* Layer 3 — Full Ai (dark green, right-most) */}
        <div className="rounded-xl p-4 text-white border-2 border-[#0E3B2E] flex flex-col" style={{ background: "linear-gradient(to bottom, #0A3327, #1A5742)" }}>
          <span className="self-start text-[9px] font-extrabold uppercase tracking-[0.18em] bg-amber-400 text-[#0A3327] px-2 py-0.5 rounded">Layer 3</span>
          <div className="text-[10.5px] uppercase tracking-wider opacity-80 mt-2">Sovereign compute</div>
          <h3 className="text-sm font-bold leading-tight mt-1">On-site Ai · solar-powered · multi-factory mesh</h3>
          <div className="mt-3 flex-1">
            <ChipGrid items={layer3} accent="text-amber-300 w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
