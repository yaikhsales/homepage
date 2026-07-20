"use client";

/**
 * Team organisation chart for the /plan (Strategic DTV) portal.
 *
 * Brings the real member face photos (the same portraits used on /about)
 * into a hierarchy: Founder/Director leadership at the top, then the five
 * engineering/ops teams below, each with its lead and members. Photos are
 * matched to people by name via PHOTO.
 */

/* name → portrait (served from public/assets/about-us/teams) */
const PHOTO: Record<string, string> = {
  "Sin Lam Yeung — Arnold": "/assets/about-us/teams/Mr-Arnold.png",
  "Gamini K": "/assets/about-us/teams/gamini.png",
  "Peang Sereysothirich": "/assets/about-us/teams/rich.png",
  "Van Virot": "/assets/about-us/teams/virot.jpg",
  "Samnang Keo": "/assets/about-us/teams/samnang.png",
  "Dilan Lakmal": "/assets/about-us/teams/dilan.jpg",
  "Samipath Yasomi": "/assets/about-us/teams/yasomi.png",
  "Pich Daly": "/assets/about-us/teams/daly.png",
  "Chhang Mengchhay": "/assets/about-us/teams/chhay.png",
  "Chhim Seangleng": "/assets/about-us/teams/seangleng.jpg",
  "Koem Chichhong": "/assets/about-us/teams/chhorng.jpg",
  "Yeom Chetra": "/assets/about-us/teams/Yeom-Chetra.jpeg",
  "Sobon Menghorng": "/assets/about-us/teams/Sobon-Menghorng.jpg",
  "Sin Khun": "/assets/about-us/teams/Sin-Khun.jpeg",
  "Proeurng Sokhim": "/assets/about-us/teams/Proeurng-Sokhim.png",
  "Voun Thida": "/assets/about-us/teams/Voun-Thida.png",
  "Dot Sreynoch": "/assets/about-us/teams/Dot-Sreynoch.jpeg",
  "Ton Noeun": "/assets/about-us/teams/Ton-Noeun.jpeg",
  "Young Sengheang": "/assets/about-us/teams/Young-Sengheang.jpeg",
  "Van Phanith": "/assets/about-us/teams/Van-Phanith.jpeg",
  "Koem Phanny": "/assets/about-us/teams/Koem-Phanny.jpeg",
};

function photoFor(name: string): string | undefined {
  if (PHOTO[name]) return PHOTO[name];
  // tolerate the spelling variants used in the cluster data
  const alt: Record<string, string> = {
    "Yoem Chetra": "Yeom Chetra",
    "Dot Sreynach": "Dot Sreynoch",
  };
  return alt[name] ? PHOTO[alt[name]] : undefined;
}

type Person = { name: string; role?: string; support?: boolean };
type Team = { name: string; accent: string; lead: Person; members: Person[] };

const LEADERSHIP: Person[] = [
  { name: "Sin Lam Yeung — Arnold", role: "Founder / Director" },
  { name: "Gamini K", role: "Director" },
];

const TEAMS: Team[] = [
  {
    name: "Sales & Admin",
    accent: "#1E4DAA",
    lead: { name: "Pich Daly", role: "Project Management & Training" },
    members: [
      { name: "Koem Phanny", role: "HR, Pay, Legal & HR Training" },
      { name: "Sin Khun", role: "Hardware Integration · Ai Vision · CE Trainer" },
      { name: "Chhang Mengchhay", role: "App Dev · E-commerce · Banking · E-payment", support: true },
      { name: "Dot Sreynoch", role: "Digital Audit", support: true },
    ],
  },
  {
    name: "Architecture",
    accent: "#F37021",
    lead: { name: "Peang Sereysothirich", role: "Chief Architecture · Server Master" },
    members: [
      { name: "Voun Thida", role: "Payroll · MOL System Integration" },
      { name: "Van Phanith", role: "HR System" },
    ],
  },
  {
    name: "Neural Net + Finance",
    accent: "#1A5742",
    lead: { name: "Van Virot", role: "API · Ai Agent Integration" },
    members: [
      { name: "Chhim Seangleng", role: "Purchase Request · Shop · Accounting & Financial" },
      { name: "Ton Noeun", role: "TPM · MRP · FC" },
    ],
  },
  {
    name: "Mobile Apps",
    accent: "#2D9D9A",
    lead: { name: "Samnang Keo", role: "Lead App Dev · Ai Server Master" },
    members: [
      { name: "Chhang Mengchhay", role: "App Dev · E-commerce · Banking · E-payment" },
      { name: "Yeom Chetra", role: "AIoT Hardware · Production App · Sensors" },
    ],
  },
  {
    name: "Operations Systems",
    accent: "#0A1F47",
    lead: { name: "Dilan Lakmal" },
    members: [
      { name: "Samipath Yasomi" },
      { name: "Koem Chichhong" },
      { name: "Young Sengheang" },
      { name: "Proeurng Sokhim" },
    ],
  },
];

function Portrait({
  p,
  size = 64,
  ring,
}: {
  p: Person;
  size?: number;
  ring?: string;
}) {
  const src = photoFor(p.name);
  const initial = p.name.replace(/—.*/, "").trim().charAt(0).toUpperCase();
  return (
    <div className="flex flex-col items-center text-center w-[92px] shrink-0">
      <div
        className="rounded-full overflow-hidden bg-slate-100 shadow-md"
        style={{ width: size, height: size, boxShadow: ring ? `0 0 0 3px ${ring}` : undefined }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-yai-orange">
            {initial}
          </div>
        )}
      </div>
      <div className="mt-1.5 text-[11px] font-semibold text-yai-navy leading-tight">
        {p.name.replace(" — ", "\n").split("\n")[0]}
      </div>
      {p.role && <div className="text-[10px] text-yai-orange font-semibold">{p.role}</div>}
      {p.support && <div className="text-[9px] uppercase tracking-wide text-slate-400">Tech support</div>}
    </div>
  );
}

export function TeamOrgChart() {
  return (
    <div className="mt-2">
      {/* Leadership */}
      <div className="flex justify-center gap-8">
        {LEADERSHIP.map((p) => (
          <Portrait key={p.name} p={p} size={84} ring="#F37021" />
        ))}
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-px h-6 bg-slate-300" />
      </div>
      <div className="mx-auto max-w-5xl h-px bg-slate-300" />

      {/* Teams */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
        {TEAMS.map((t) => (
          <div key={t.name} className="flex flex-col items-center">
            <div
              className="mb-3 px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wide"
              style={{ background: t.accent }}
            >
              {t.name}
            </div>
            <Portrait p={{ ...t.lead, role: t.lead.role || "Lead" }} size={72} ring={t.accent} />
            <div className="w-px h-4 bg-slate-200 my-1" />
            <div className="flex flex-col gap-3">
              {t.members.map((m, i) => (
                <Portrait key={m.name + i} p={m} size={54} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
