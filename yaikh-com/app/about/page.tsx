"use client";

/* /customers — Ported from yaikh-dashboard/src/components/AboutUs.js.
 *
 * The "Customers" nav link on the homepage opens this page. It introduces
 * TexLink Technologies (the company behind Yaikh) in Khmer + English +
 * Chinese, shows our certificates, regional flags, tech stack, and the
 * full team grid.
 *
 * Replaced the V2 react-router useNavigate with Next.js navigation; the
 * Back button uses next/link. ImageViewer / DocumentViewer are inlined
 * as small overlay components instead of separate files (each was ~50
 * lines).
 *
 * Assets live at /public/assets/about-us/ — copied from V2 alongside
 * this port. Heavy media (none here — these are all small photos +
 * certificate JPGs/PNGs) so they stay in git rather than moving to
 * Drive/Mongo at this stage. */

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, X } from "lucide-react";

interface TeamMember {
  name: string;
  image: string;
  linkedin?: string;
  role?: string;
}

const ABOUT_CONTENT = [
  {
    language: "ខ្មែរ",
    isKhmer: true,
    text: "Yaikh គឺជាវេទិកាដំណោះស្រាយសម្រាប់ការផលិតដែលត្រូវបានរចនាជាពិសេសសម្រាប់ការផលិតសម្លៀកបំពាក់ ស្បែកជើង កាបូប និងផលិតផល ក្រណាត់ស្រាលទន់ៗ ផ្សេងៗ។ ជាកម្មសិទ្ធិរបស់ TexLink Technologies ដែលបានចុះបញ្ជីនៅកម្ពុជា វេទិកានេះដំណើរការលើប្រព័ន្ធ Windows, iOS, និង Android។",
  },
  {
    language: "English",
    isKhmer: false,
    text: "Yaikh is a manufacturing solution platform specially designed for garment, footwear, bags, and softgoods manufacturing. Owned by TexLink Technologies registered in Cambodia, the platform operates on Windows, iOS, and Android platforms.",
  },
  {
    language: "中文",
    isKhmer: false,
    text: "Yaikh 是一个专门为服装、鞋类、箱包和软质品制造业设计的生产解决方案平台。该平台归属在柬埔寨注册的 TexLink Technologies 公司所有，并支持 Windows、iOS和Android 操作系统",
  },
];

const TEAM: TeamMember[] = [
  { name: "Sin Lam Yeung — Arnold", image: "/assets/about-us/teams/Mr-Arnold.png", linkedin: "https://www.linkedin.com/in/sin-lam-yeung-898a22418/", role: "Founder / Director" },
  { name: "Gamini K",           image: "/assets/about-us/teams/gamini.png", linkedin: "https://www.linkedin.com/in/gaminisg/", role: "Director" },
  { name: "Peang Sereysothirich", image: "/assets/about-us/teams/rich.png" },
  { name: "Van Virot",          image: "/assets/about-us/teams/virot.jpg", linkedin: "https://www.linkedin.com/in/van-virot-120bb0298/" },
  { name: "Samnang Keo",        image: "/assets/about-us/teams/samnang.png", linkedin: "https://www.linkedin.com/in/samnang23/" },
  { name: "Dilan Lakmal",       image: "/assets/about-us/teams/dilan.jpg" },
  { name: "Samipath Yasomi",    image: "/assets/about-us/teams/yasomi.png" },
  { name: "Pich Daly",          image: "/assets/about-us/teams/daly.png", linkedin: "https://www.linkedin.com/in/daly-pich-6ba6ab40b/" },
  { name: "Chhang Mengchhay",   image: "/assets/about-us/teams/chhay.png" },
  { name: "Chhim Seangleng",    image: "/assets/about-us/teams/seangleng.jpg" },
  { name: "Koem Chichhong",     image: "/assets/about-us/teams/chhorng.jpg" },
  { name: "Yeom Chetra",        image: "/assets/about-us/teams/Yeom-Chetra.jpeg" },
  { name: "Sobon Menghorng",    image: "/assets/about-us/teams/Sobon-Menghorng.jpg" },
  { name: "Sin Khun",           image: "/assets/about-us/teams/Sin-Khun.jpeg" },
  { name: "Proeurng Sokhim",    image: "/assets/about-us/teams/Proeurng-Sokhim.png" },
  { name: "Voun Thida",         image: "/assets/about-us/teams/Voun-Thida.png" },
  { name: "Dot Sreynoch",       image: "/assets/about-us/teams/Dot-Sreynoch.jpeg" },
  { name: "Ton Noeun",          image: "/assets/about-us/teams/Ton-Noeun.jpeg" },
  { name: "Young Sengheang",    image: "/assets/about-us/teams/Young-Sengheang.jpeg" },
  { name: "Van Phanith",        image: "/assets/about-us/teams/Van-Phanith.jpeg" },
  { name: "Koem Phanny",        image: "/assets/about-us/teams/Koem-Phanny.jpeg" },
];

const CERTIFICATES = [
  { name: "MOC",             image: "/assets/about-us/certificates/moc.png" },
  { name: "ICT Certificate", image: "/assets/about-us/certificates/ict-certificate.jpg" },
  { name: "TAFTAC",          image: "/assets/about-us/certificates/taftac.png" },
  { name: "QIP CDC",         image: "/assets/about-us/certificates/qip-cdc.png" },
];

const TECHNOLOGIES = [
  { name: "Laravel",  logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/laravel.svg",    color: true },
  { name: "MongoDB",  logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg",    color: true },
  { name: "React",    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg",      color: true },
  { name: "Node.js",  logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg",  color: true },
  { name: "Express",  logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/express.svg",    color: true },
  { name: "Gemini",   logo: "https://cdn.simpleicons.org/googlegemini?v=1",                     color: false },
  { name: "DeepSeek", logo: "/assets/about-us/deepseek.png",                                    color: false },
  { name: "Claude",   logo: "https://cdn.simpleicons.org/claude",                               color: false },
  { name: "Nvidia",   logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nvidia.svg",    color: true },
  { name: "AMD",      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amd.svg",       color: true },
  { name: "GitHub",   logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",    color: true },
];

// Recolour filter for monochrome tech logos — page background is dark
// navy (mesh-hero), so we recolour the SVG icons to cream so they stand
// out against the brand background.
const COLOR_FILTER =
  "brightness(0) saturate(100%) invert(95%) sepia(11%) saturate(372%) hue-rotate(331deg) brightness(105%) contrast(98%)";

export default function CustomersPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf]   = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[300] flex flex-col overflow-hidden mesh-hero">
      {/* Header: solid navy bar with subtle border so it reads as a chrome
          element separate from the mesh body */}
      <header className="bg-yai-navy/95 backdrop-blur text-white shadow-lg border-b border-yai-orange/30 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-3 flex-shrink-0 relative z-10">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-white/90 hover:text-yai-orange hover:bg-white/5 rounded-lg transition-colors text-sm sm:text-base"
        >
          <ArrowLeft size={18} />
          <span className="font-medium hidden sm:inline">Home</span>
        </Link>
        <Link
          href="/"
          title="Home"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-yai-orange/70 hover:border-yai-orange transition-all hover:scale-110 flex-shrink-0 shadow-md"
        >
          <img src="/logo.jpg" alt="Home" className="w-full h-full object-cover" />
        </Link>
      </header>

      {/* Body — 3-column desktop / stacked on smaller */}
      <main className="flex-1 overflow-auto p-3 md:p-5">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* LEFT: Logo + name + registration card + certificates */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              {/* Identity card — no background; sits directly on the mesh-hero
                  page background so the navy + radial gradients show through */}
              <div className="px-4 md:px-5 py-1 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-full overflow-hidden bg-yai-orange p-0">
                    <img src="/logo.jpg" alt="Yai" className="w-full h-full object-cover" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-base md:text-lg font-bold">YaiKh</div>
                    <div
                      className="text-sm md:text-base"
                      style={{ fontFamily: '"Khmer OS Battambang", sans-serif' }}
                    >
                      តិចលីង តិចណូឡូជី ឯ.ក
                    </div>
                  </div>
                </div>
                <div className="text-[12px] md:text-[13px] leading-relaxed space-y-1 border-t border-white/15 pt-3">
                  <div className="font-semibold">TexLink Technologies Co., Ltd.</div>
                  <div className="text-white/85">
                    <span className="opacity-70">Reg.</span> 1000542518
                    <span className="opacity-50 mx-1.5">·</span>
                    <span className="opacity-70">03 Oct 2025</span>
                  </div>
                  <div className="text-white/85">
                    TSF-038A Kolap Street, Damnak Village,<br />
                    Sen Sok, Phnom Penh, Cambodia.
                  </div>
                  <div className="text-white/95 italic pt-1">
                    Ai-Native Manufacturing Intelligence Platform.
                  </div>
                </div>
              </div>

              {/* Certificates stack */}
              <div className="flex flex-col gap-2 mt-2">
                {CERTIFICATES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      if (c.image.endsWith(".pdf")) setSelectedPdf(c.image);
                      else setSelectedImage(c.image);
                    }}
                    className="block cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                    aria-label={c.name}
                  >
                    {c.image.endsWith(".pdf") ? (
                      <div className="w-full h-24 bg-yai-cream/40 border-2 border-dashed border-yai-navy/30 rounded flex flex-col items-center justify-center text-yai-navy/60 hover:text-yai-orange hover:border-yai-orange/60 transition-colors">
                        <FileText size={24} />
                        <span className="text-xs font-semibold mt-1">{c.name}</span>
                      </div>
                    ) : (
                      <img src={c.image} alt={c.name} className="w-full h-auto max-h-40 object-contain rounded ring-1 ring-yai-navy/10 shadow-sm hover:ring-yai-orange/40 hover:shadow-md transition-all" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CENTER: Flags + 3-language description + tech stack */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Flags */}
              <div className="flex items-start justify-center gap-3 md:gap-4 mb-2">
                {[
                  { name: "Hong Kong",  src: "/assets/about-us/flags/Hongkong.svg" },
                  { name: "Cambodia",   src: "/assets/about-us/flags/cambodia-4k.png" },
                  { name: "Singapore",  src: "/assets/about-us/flags/Singapore-4k.png" },
                ].map((f) => (
                  <div key={f.name} className="flex flex-col items-center">
                    <img src={f.src} alt={f.name} className="h-10 md:h-14 w-auto object-contain shadow-sm" />
                    <span className="text-[10px] font-semibold text-white/85 mt-1 uppercase tracking-wider">{f.name}</span>
                  </div>
                ))}
              </div>

              {/* 3-language description */}
              <div className="space-y-3 mb-4 py-2">
                {ABOUT_CONTENT.map((c) => (
                  <div key={c.language} className="text-center">
                    <h4
                      className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1"
                      style={{
                        fontFamily: c.isKhmer ? '"Khmer OS Battambang", sans-serif' : "Inter, sans-serif",
                      }}
                    >
                      {c.language}
                    </h4>
                    <p
                      className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed break-words"
                      style={{
                        fontFamily: c.isKhmer ? '"Khmer OS Battambang", sans-serif' : "Inter, sans-serif",
                      }}
                    >
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tech stack */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-white mb-2 text-center uppercase tracking-wider">
                  Technologies
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {TECHNOLOGIES.map((t) => (
                    <div key={t.name} className="flex flex-col items-center justify-center">
                      <div className="w-7 h-7 md:w-9 md:h-9 mb-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.logo}
                          alt={t.name}
                          className="w-full h-full object-contain"
                          style={{ filter: t.color ? COLOR_FILTER : "none" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.filter = "none";
                            (e.target as HTMLImageElement).src =
                              `https://via.placeholder.com/48x48/0A1F47/F37021?text=${t.name.charAt(0)}`;
                          }}
                        />
                      </div>
                      <span className="text-[10px] md:text-xs font-semibold text-white/85 text-center">
                        {t.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Team Members grid */}
            <div className="lg:col-span-3 flex flex-col">
              <h3 className="text-base md:text-lg xl:text-xl font-bold text-white mb-2 md:mb-3 text-center uppercase tracking-wider">
                Team Members
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-5 md:gap-x-5 md:gap-y-7 content-start">
                {TEAM.map((m) => (
                  <div key={m.name} className="flex flex-col items-center">
                    <img
                      src={m.image}
                      alt={m.name}
                      // image-rendering: high-quality + object-cover keeps small
                      // source photos as sharp as the browser can render them;
                      // ring + slight shadow give them visual weight on the
                      // light Yai-bg page background.
                      className="w-14 h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] rounded-full object-cover mb-1 ring-2 ring-yai-orange/30 shadow-md"
                      style={{ imageRendering: "auto" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://via.placeholder.com/96x96/0A1F47/F37021?text=${m.name.charAt(0)}`;
                      }}
                    />
                    <p className="text-[10px] md:text-xs font-medium text-white/90 text-center leading-tight">
                      {m.name}
                    </p>
                    {m.role && (
                      <p className="text-[9px] md:text-[10px] text-yai-orange/90 text-center leading-tight mt-0.5">
                        {m.role}
                      </p>
                    )}
                    {/* Individual LinkedIn profile — small icon under the name.
                        Falls back to "#" until each member's URL is filled in. */}
                    <a
                      href={m.linkedin || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      className="mt-1.5 inline-flex items-center justify-center text-[#0A66C2] hover:scale-110 transition-transform"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image viewer overlay (inlined — replaces V2's ImageViewer.js) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[400] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            className="absolute top-4 right-4 text-white hover:text-yai-orange p-2"
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <img src={selectedImage} alt="Certificate" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      {/* PDF viewer overlay (inlined — replaces V2's DocumentViewer.js) */}
      {selectedPdf && (
        <div
          className="fixed inset-0 z-[400] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPdf(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedPdf(null); }}
            className="absolute top-4 right-4 text-white hover:text-yai-orange p-2"
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <iframe src={selectedPdf} className="w-full max-w-5xl h-[90vh] bg-white" title="Document" />
        </div>
      )}
    </div>
  );
}
