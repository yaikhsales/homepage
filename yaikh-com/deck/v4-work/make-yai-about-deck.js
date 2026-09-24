/* Yai About deck — 4 slides, same look as the pitch deck (make-yai-deck-v4.js).
 * Slide 1 is the whole yaikh.com/about page rebuilt for a 1280×720 slide:
 * company block + certificates · flags + KH/EN/ZH text + technologies · team grid.
 * Slides 2–4 are placeholders until Gamini says what goes on them.
 *
 * Assets: img-about/{team,cert,tech} (copied from yaikh-com/public/assets/about-us)
 * plus the flags and logo already in img-lite/.
 * Run:  node make-yai-about-deck.js  →  yai-deck-v4-about.html            */

const fs = require("fs");
const path = require("path");

const LITE = path.join(__dirname, "img-lite");
const AB = path.join(__dirname, "img-about");
const OUT = path.join(__dirname, "yai-deck-v4-about.html");

let bytes = 0;
function uri(p) {
  const buf = fs.readFileSync(p);
  bytes += buf.length;
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "svg" ? "image/svg+xml" : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const logo = uri(path.join(LITE, "pub", "yai-logo.jpg"));
const flag = {
  hk: uri(path.join(LITE, "hk-flag.png")),
  kh: uri(path.join(LITE, "kh-flag.png")),
  sg: uri(path.join(LITE, "sg-flag.png")),
};
const team = uri.bind(null); // helper below uses full paths

const TEAM = [
  ["Sin Lam Yeung — Arnold", "arnold", "Founder / Director"],
  ["Gamini K", "gamini", "Director"],
  ["Peang Sereysothirich", "rich", ""],
  ["Van Virot", "virot", ""],
  ["Samnang Keo", "samnang", ""],
  ["Dilan Lakmal", "dilan", ""],
  ["Samipath Yasomi", "yasomi", ""],
  ["Pich Daly", "daly", ""],
  ["Chhim Seangleng", "seangleng", ""],
  ["Yeom Chetra", "chetra", ""],
  ["Sin Khun", "khun", ""],
  ["Proeurng Sokhim", "sokhim", ""],
  ["Voun Thida", "thida", ""],
  ["Dot Sreynoch", "sreynoch", ""],
  ["Ton Noeun", "noeun", ""],
  ["Young Sengheang", "sengheang", ""],
  ["Van Phanith", "phanith", ""],
  ["Koem Phanny", "phanny", ""],
];
const CERTS = [["MOC", "moc"], ["ICT Certificate", "ict"], ["TAFTAC", "taftac"]];
// Monochrome marks get recoloured to cream; brand-coloured SVGs stay as they are.
const TECH = [
  ["Anthropic Claude", "claude.svg", 0, "anthropic.svg"], ["Google Gemini", "googlegemini.svg", 0, "google-g.svg"], ["Nvidia", "nvidia.svg", 1],
  ["DeepSeek", "deepseek.png", 0], ["Laravel", "laravel.svg", 1], ["MongoDB", "mongodb.svg", 1],
  ["React", "react.svg", 1], ["Node.js", "nodedotjs.svg", 1], ["Express", "express.svg", 1],
  ["AMD", "amd.svg", 1], ["GitHub", "github.svg", 1],
];
const ABOUT = [
  ["ខ្មែរ", "Yaikh គឺជាវេទិកាដំណោះស្រាយសម្រាប់ការផលិតដែលត្រូវបានរចនាជាពិសេសសម្រាប់ការផលិតសម្លៀកបំពាក់ ស្បែកជើង កាបូប និងផលិតផល ក្រណាត់ស្រាលទន់ៗ ផ្សេងៗ។ ជាកម្មសិទ្ធិរបស់ Texlink Technologies ដែលបានចុះបញ្ជីនៅកម្ពុជា វេទិកានេះដំណើរការលើប្រព័ន្ធ Windows, iOS, និង Android។", 1],
  ["English", "Yaikh is a manufacturing solution platform specially designed for garment, footwear, bags, and softgoods manufacturing. Owned by Texlink Technologies registered in Cambodia, the platform operates on Windows, iOS, and Android platforms.", 0],
  ["中文", "Yaikh 是一个专门为服装、鞋类、箱包和软质品制造业设计的生产解决方案平台。该平台归属在柬埔寨注册的 Texlink Technologies 公司所有，并支持 Windows、iOS和Android 操作系统", 0],
];

let n = 0;
const TOTAL = 3;
function slide(kind, eyebrow, body, opts = {}) {
  n += 1;
  return `
<section class="slide ${kind === "light" ? "light" : "dark"} ${opts.cls || ""}" id="s${n}">
  ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ""}
  ${body}
  <footer class="sig"><span>www.yaikh.com</span><span class="sig-mid"><img src="${logo}" alt=""><b>Yai</b></span><span>${n} / ${TOTAL}</span></footer>
</section>`;
}

const S = [];

/* 1 · ABOUT — the whole yaikh.com/about page on one slide */
S.push(slide("dark", "", `
<div class="ab">
  <!-- left: company + certificates -->
  <div class="ab-col ab-left">
    <div class="ab-brand">
      <img class="ab-logo" src="${logo}" alt="Yai">
      <div>
        <div class="ab-name">YaiKh</div>
      </div>
    </div>
    <div class="ab-meta">Reg. 1000542518 · 03 Oct 2025</div>
    <div class="ab-meta">TSF-038A Kolap Street, Damnak Village,<br>Sen Sok, Phnom Penh, Cambodia.</div>
    <div class="ab-tag">Ai-Native Manufacturing Intelligence for Soft Goods.</div>
    <div class="ab-certs">${CERTS.map(([label, slug]) => `<figure><img src="${uri(path.join(AB, "cert", slug + ".png"))}" alt="${esc(label)}"></figure>`).join("")}</div>
  </div>

  <!-- middle: flags · three languages · technologies -->
  <div class="ab-col ab-mid">
    <div class="ab-flags">
      <figure><img src="${flag.hk}" alt=""><figcaption>Hong Kong</figcaption></figure>
      <figure><img src="${flag.kh}" alt=""><figcaption>Cambodia</figcaption></figure>
      <figure><img src="${flag.sg}" alt=""><figcaption>Singapore</figcaption></figure>
    </div>
    <div class="ab-company-kh">តិចលីង តិចណូឡូជី ឯ.ក</div>
    <div class="ab-company">Texlink Technologies Co., Ltd.</div>
    ${ABOUT.map(([lang, text, isKh]) => `<div class="ab-lang"><div class="ab-langname${isKh ? " kh" : ""}">${esc(lang)}</div><p class="ab-text${isKh ? " kh" : ""}">${esc(text)}</p></div>`).join("")}
    <div class="ab-techhead">Technologies</div>
    <div class="ab-tech">${TECH.map(([label, file, mono, pre]) => `<figure>${pre ? `<span class="twin"><img src="${uri(path.join(AB, "tech", pre))}" alt=""><img src="${uri(path.join(AB, "tech", file))}" alt=""></span>` : `<img class="${mono ? "mono" : ""}" src="${uri(path.join(AB, "tech", file))}" alt="${esc(label)}">`}<figcaption>${esc(label)}</figcaption></figure>`).join("")}</div>
  </div>

  <!-- right: the team -->
  <div class="ab-col ab-right">
    <div class="ab-teamhead">Team members</div>
    <div class="ab-team">${TEAM.map(([name, slug, role]) => `<figure class="t-${slug}"><img src="${uri(path.join(AB, "team", slug + ".png"))}" alt="${esc(name)}"><figcaption>${esc(name)}${role ? `<span>${esc(role)}</span>` : ""}</figcaption></figure>`).join("")}</div>
  </div>
</div>
`, { cls: "aboutslide" }));

/* 3 · Ai-NATIVE MiP — three rounds: blue, green, green */
S.push(slide("dark", "", `
<h2 class="mip-h">The only commercial Ai-Native Manufacturing Intelligence Platform.</h2>
<div class="mip-pc"><svg viewBox="0 0 250 372" aria-hidden="true">
  <defs><clipPath id="pcLogoT"><circle cx="76" cy="256" r="20"/></clipPath><clipPath id="pcLogoP"><circle cx="196" cy="272" r="15"/></clipPath><clipPath id="pcLogoM"><circle cx="60" cy="33" r="13"/></clipPath></defs>
  <rect class="pc-body" x="30" y="6" width="190" height="128" rx="12"/>
  <rect class="pc-screen" x="41" y="17" width="168" height="106" rx="7"/>
  <circle class="pc-logoring" cx="60" cy="33" r="14"/>
  <image href="${logo}" x="46" y="19" width="28" height="28" clip-path="url(#pcLogoM)" preserveAspectRatio="xMidYMid slice"/>
  <circle class="pc-dot blue" cx="105" cy="56" r="25"/>
  <circle class="pc-dot green" cx="145" cy="56" r="25"/>
  <circle class="pc-dot green" cx="125" cy="88" r="25"/>
  <path class="pc-body" d="M125 134v20"/>
  <rect class="pc-body" x="88" y="154" width="74" height="10" rx="5"/>
  <path class="pc-wire" d="M220 52C238 52 242 74 250 74"/>
  <path class="pc-wire" d="M220 88C238 88 244 112 250 112"/>
  <circle class="pc-plug" cx="248" cy="74" r="5"/>
  <circle class="pc-plug" cx="248" cy="112" r="5"/>
  <rect class="pc-body" x="20" y="212" width="112" height="150" rx="12"/>
  <rect class="pc-screen" x="30" y="224" width="92" height="126" rx="5"/>
  <circle class="pc-logoring" cx="76" cy="256" r="21"/>
  <image href="${logo}" x="55" y="235" width="42" height="42" clip-path="url(#pcLogoT)" preserveAspectRatio="xMidYMid slice"/>
  <rect class="pc-ui" x="44" y="292" width="64" height="7" rx="3.5"/>
  <rect class="pc-ui" x="44" y="306" width="46" height="7" rx="3.5"/>
  <rect class="pc-ui hot" x="44" y="320" width="30" height="7" rx="3.5"/>
  <rect class="pc-body" x="156" y="228" width="80" height="134" rx="14"/>
  <rect class="pc-screen" x="165" y="244" width="62" height="102" rx="4"/>
  <path class="pc-body" d="M186 236h20"/>
  <circle class="pc-logoring" cx="196" cy="272" r="16"/>
  <image href="${logo}" x="180" y="256" width="32" height="32" clip-path="url(#pcLogoP)" preserveAspectRatio="xMidYMid slice"/>
  <rect class="pc-ui" x="175" y="300" width="42" height="6" rx="3"/>
  <rect class="pc-ui" x="175" y="312" width="30" height="6" rx="3"/>
  <rect class="pc-ui hot" x="175" y="324" width="20" height="6" rx="3"/>
</svg>
<div class="pc-cap">PC &amp; Web · Tablet · Phone<span>iOS &amp; Android</span></div></div>
<div class="mip-tech">
  <figure><span class="twin"><img src="${uri(path.join(AB, "tech", "anthropic.svg"))}" alt=""><img src="${uri(path.join(AB, "tech", "claude.svg"))}" alt=""></span><figcaption>Anthropic Claude</figcaption></figure>
  <figure><span class="twin"><img src="${uri(path.join(AB, "tech", "google-g.svg"))}" alt=""><img src="${uri(path.join(AB, "tech", "googlegemini.svg"))}" alt=""></span><figcaption>Google Gemini</figcaption></figure>
  <figure><img class="mono" src="${uri(path.join(AB, "tech", "nvidia.svg"))}" alt="Nvidia"><figcaption>Nvidia</figcaption></figure>
  <figure><img class="bank" src="${uri(path.join(AB, "tech", "aba.png"))}" alt="ABA Bank"><figcaption>ABA</figcaption></figure>
  <figure><img class="bank" src="${uri(path.join(AB, "tech", "wing.png"))}" alt="Wing Bank"><figcaption>Wing</figcaption></figure>
</div>
<div class="mip">
  <div class="mip-round blue">
    <svg class="mip-arc" viewBox="0 0 344 344"><path id="arc1" d="M30.0,172.0 A142.0,142.0 0 0 1 314.0,172.0" fill="none"/><text style="font-size:27px"><textPath href="#arc1" startOffset="50%" text-anchor="middle">Administration Ai</textPath></text></svg>
    <div class="mip-sat s1">Accounting<br>&amp; Tax</div>
    <div class="mip-sat s2">HR &amp; Pay</div>
    <div class="mip-sat s3">Admin</div>
    <div class="mip-sat s4">Logistics</div>
    <div class="mip-sat s5 sm">Compliance<br>&amp; Sustainability</div>
  </div>
  <div class="mip-round green big">
    <svg class="mip-arc" viewBox="0 0 344 344"><path id="arc2" d="M30.0,172.0 A142.0,142.0 0 0 1 314.0,172.0" fill="none"/><text style="font-size:27px"><textPath href="#arc2" startOffset="50%" text-anchor="middle">Operation Ai</textPath></text></svg>
    <div class="mip-sat s1">Quality Ai</div>
    <div class="mip-sat s2">Inventory Ai</div>
    <div class="mip-sat s3">IE Ai</div>
    <div class="mip-sat s4 sm">Product<br>Development Ai</div>
    <div class="mip-sat s5 sm">Merchandising<br>Ai</div>
  </div>
  <div class="mip-round green">
    <svg class="mip-arc" viewBox="0 0 300 300"><path id="arc3" d="M26.0,150.0 A124.0,124.0 0 0 1 274.0,150.0" fill="none"/><text style="font-size:22px"><textPath href="#arc3" startOffset="50%" text-anchor="middle">Management &amp; Corporate Ai</textPath></text></svg>
    <div class="mip-sat t1 sm">Big Brain<br>Dashboard</div>
    <div class="mip-sat t2 sm">Data<br>Analysis</div>
    <div class="mip-sat t3">SOP Ai</div>
  </div>
</div>
`, { cls: "mipslide" }));

/* 4 · COMPLIANCE & SUSTAINABILITY */
S.push(slide("dark", "", `
<div class="cs-title"><img class="cs-logo" src="${logo}" alt="Yai"><h2 class="mip-h">AIoT Sustainability Data Platform, <span class="cs-kicker">Revolutionising the way compliance is done.</span></h2></div>
<div class="cs">
  <div class="cs-col c1"><div class="cs-head">Legal EMS</div>
    <div class="cs-body">
      <img class="cs-photo" src="${uri(path.join(AB, "photo", "ems-dashboard.jpg"))}" alt="EMS dashboard in the Yai app">
      <p class="cs-text">Ai reviews every legal document and its supporting papers, and raises the non-compliance issues it finds.</p>
    </div></div>
  <div class="cs-col c2"><div class="cs-head">Energy</div>
    <div class="cs-body">
      <img class="cs-photo" src="${uri(path.join(AB, "photo", "energy-meter.jpg"))}" alt="AIoT energy meter">
      <p class="cs-text">Monitoring and reporting energy use from every source — down to the device that draws it.</p>
    </div></div>
  <div class="cs-col c3"><div class="cs-head">Waste</div>
    <div class="cs-body">
      <img class="cs-photo" src="${uri(path.join(AB, "photo", "wall-pad.jpg"))}" alt="Wall-mounted pad at the waste door">
      <img class="cs-photo wide" src="${uri(path.join(AB, "photo", "waste-kpi.jpg"))}" alt="Waste totals in the Yai app">
      <p class="cs-text">The bag leaving the floor is logged on the pad mounted at the door — kilos and waste type, on the spot.</p>
    </div></div>
  <div class="cs-col c4"><div class="cs-head">Water</div>
    <div class="cs-body">
      <img class="cs-photo" src="${uri(path.join(AB, "photo", "water-meter.jpg"))}" alt="AIoT water meter">
      <p class="cs-text">AIoT water meters read the government supply coming in and what every department draws from it.</p>
    </div></div>
  <div class="cs-col c5"><div class="cs-head">Waste Water</div>
    <div class="cs-body">
      <img class="cs-photo" src="${uri(path.join(AB, "photo", "water-ions.jpg"))}" alt="Waste-water quality sensors">
      <span class="cs-tag">Substance sensors</span>
      <img class="cs-photo sm" src="${uri(path.join(AB, "photo", "water-meter.jpg"))}" alt="Waste-water flow meter">
      <span class="cs-tag">Flow meter</span>
      <p class="cs-text">Sensors read the quality of the waste water; the meter reads how much of it leaves.</p>
    </div></div>
  <div class="cs-col c6"><div class="cs-head">Air Emission</div>
    <div class="cs-body">
      <img class="cs-photo" src="${uri(path.join(AB, "photo", "air-sensor.jpg"))}" alt="Air quality sensor">
      <p class="cs-text">Sensors watch humidity, temperature and the gas types in the air, and report them as they change.</p>
    </div></div>
  <div class="cs-col c7"><div class="cs-head">Chemical</div>
    <div class="cs-body">
      <img class="cs-photo" src="${uri(path.join(AB, "photo", "chem-inventory.jpg"))}" alt="Chemical inventory in the Yai app">
      <p class="cs-text">Eco passports on file for every chemical, and stock controlled from the mobile app — issued, on hand, audit trail.</p>
    </div></div>
</div>
`, { cls: "csslide" }));

const html = `<!doctype html>
<meta charset="utf-8"><title>Yai About Deck</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--navy:#0A1F47;--blue:#1E4DAA;--orange:#F37021;--green:#10B981;--dgreen:#0A3327;--gold:#FFD58A;--cream:#F7F5EF;--mint:#ECFDF5;--ink:#1E293B;--gray:#64748B;--line:#E2E8F0}
*{box-sizing:border-box}
body{margin:0;background:#0b1020;font-family:Arial,Helvetica,sans-serif;color:var(--ink)}
@page{size:1280px 720px;margin:0}
@media print{body{background:#fff}.deck{padding:0}.slide{margin:0;border-radius:0;box-shadow:none;break-after:page}}
.deck{padding:1px 0}
.slide{position:relative;width:1280px;height:720px;margin:24px auto;padding:34px 44px 60px;border-radius:14px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.35)}
.slide.dark{background:var(--navy);color:#fff}
.slide.light{background:var(--cream);color:var(--ink)}
.eyebrow{font-size:28px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--orange);margin-bottom:14px}
h2{margin:0 0 10px;font-size:44px;line-height:1.12;color:var(--navy)}
.sub{margin:0 0 22px;font-size:24px;font-style:italic;color:var(--gray)}
.sig{position:absolute;left:44px;right:44px;bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:17px;letter-spacing:.08em;color:var(--gray)}
.sig-mid{display:flex;align-items:center;gap:8px;color:var(--orange);font-weight:700}
.sig-mid img{width:22px;height:22px;border-radius:50%;object-fit:cover}
.dark .sig{color:#8FA8D8}

/* ── slide 1 · About ───────────────────────────────────────────── */
.aboutslide{padding:22px 26px 46px}
.ab{display:grid;grid-template-columns:310px 1fr 300px;gap:18px;height:640px}
.ab-col{min-width:0}
.ab-left{display:flex;flex-direction:column}
.ab-brand{display:flex;align-items:center;gap:12px}
.ab-logo{width:62px;height:62px;border-radius:50%;object-fit:cover}
.ab-name{font-size:24px;font-weight:800;color:#fff;line-height:1.1}
.ab-kh{font-size:13px;color:#B8C4E6}
.ab-co{margin-top:12px;font-size:17px;font-weight:800;color:#fff}
.ab-meta{font-size:13.5px;color:#B8C4E6;line-height:1.45;margin-top:3px}
.ab-tag{margin-top:8px;font-size:14px;font-style:italic;color:var(--gold)}
.ab-certs{display:flex;flex-direction:column;gap:12px;margin-top:14px;flex:1;min-height:0}
.ab-certs figure{margin:0;flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center}
.ab-certs img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block;border-radius:4px}


.ab-mid{display:flex;flex-direction:column;align-items:center;text-align:center}
.ab-flags{display:flex;gap:22px;justify-content:center}
.ab-flags figure{margin:0}
.ab-flags img{height:42px;border-radius:3px;display:block}
.ab-flags figcaption{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#B8C4E6;margin-top:4px}
.ab-company-kh{margin-top:12px;font-size:38px;font-weight:700;color:#fff;line-height:1.35}
.ab-company{margin-top:2px;font-size:28px;font-weight:800;color:#fff;letter-spacing:-.01em}
.ab-lang{margin-top:8px;max-width:640px}
.ab-langname{font-size:19px;font-weight:800;color:#fff}
.ab-langname.kh{color:var(--gold)}
.ab-text{margin:2px 0 0;font-size:14.5px;line-height:1.45;color:#E6ECFA}
.ab-text.kh{font-size:14px;line-height:1.7}
.ab-techhead{margin-top:14px;font-size:14px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.ab-tech{display:grid;grid-template-columns:repeat(6,70px);gap:12px 16px;justify-content:center;margin-top:10px}
.ab-tech figure{margin:0;text-align:center}
.ab-tech img{width:36px;height:36px;object-fit:contain}
.ab-tech .twin{display:flex;align-items:center;justify-content:center;gap:4px}.ab-tech .twin img{width:30px;height:30px}
.ab-tech img.mono{filter:brightness(0) saturate(100%) invert(95%) sepia(11%) saturate(372%) hue-rotate(331deg) brightness(105%) contrast(98%)}
.ab-tech figcaption{font-size:12px;color:#B8C4E6;margin-top:3px}

.fx{display:grid;grid-template-columns:1fr 1px 1fr;gap:34px;height:560px;align-items:start}
.fx-half{display:flex;flex-direction:column;align-items:center;text-align:center}
.fx-rule{background:rgba(255,255,255,.16);height:100%}
.fx-photo{width:210px;height:210px;border-radius:50%;object-fit:cover;object-position:50% 18%;border:4px solid var(--orange)}
.fx-name{margin-top:16px;font-size:30px;font-weight:800;color:#fff}
.fx-role{margin-top:4px;font-size:20px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}
.fx-list{margin:16px 0 0;padding:0;list-style:none;text-align:left;max-width:440px}
.fx-list li{position:relative;padding-left:22px;margin-bottom:10px;font-size:20px;line-height:1.4;color:#E6ECFA}
.fx-list li::before{content:"";position:absolute;left:0;top:9px;width:9px;height:9px;border-radius:50%;background:var(--orange)}

/* ── slide 4 · Compliance & Sustainability ─────────────────────── */
.cs{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-top:0;height:548px}
.cs-col{display:flex;flex-direction:column;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);border-radius:12px;overflow:hidden}
.cs-head{padding:14px 8px;text-align:center;font-size:19px;font-weight:800;line-height:1.15;color:#fff;background:var(--blue)}
.cs-col.c2 .cs-head{background:#B45309}
.cs-col.c3 .cs-head{background:#6D28D9}
.cs-col.c4 .cs-head{background:#0E7490}
.cs-col.c5 .cs-head{background:#115E59}
.cs-col.c6 .cs-head{background:#475569}
.cs-col.c7 .cs-head{background:var(--orange)}
.cs-body{flex:1;display:flex;flex-direction:column;align-items:center;padding:12px 9px;text-align:center}
.cs-ico{width:56px;height:56px;flex:0 0 auto;fill:none;stroke:rgba(255,255,255,.85);stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.cs-ico .hot{stroke:var(--orange)}
.cs-ico.wide{width:72px;height:60px}
.cs-ico .lbl{fill:rgba(255,255,255,.9);stroke:none;font:700 13px Arial,Helvetica,sans-serif;text-anchor:middle}
.cs-photo{width:100%;height:auto;object-fit:contain;background:#fff;border-radius:8px;padding:4px}
.cs-photo.sm{width:auto;max-width:100%;max-height:86px;margin-top:6px}
.cs-photo.wide{margin-top:8px;padding:2px}
.cs-duo{display:flex;flex-direction:column;align-items:center;gap:4px;margin-bottom:10px}
.cs-tag{margin-top:4px}
.cs-ico.sm{width:46px;height:46px}
.cs-tag{font-size:14px;font-weight:700;color:var(--gold)}
.cs-text{margin:12px 0 0;font-size:17px;line-height:1.38;color:#E6ECFA}
.cs-list{margin:0;padding:14px 12px;list-style:none;flex:1}
.cs-list li{position:relative;padding-left:16px;margin-bottom:10px;font-size:17px;line-height:1.35;color:#E6ECFA}
.cs-list li::before{content:"";position:absolute;left:0;top:8px;width:7px;height:7px;border-radius:50%;background:var(--gold)}
.cs-title{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:10px}
.cs-logo{width:50px;height:50px;border-radius:50%;object-fit:cover}
.cs-title .mip-h{margin:0;font-size:26px;white-space:nowrap}
.cs-kicker{color:var(--gold)}
/* ── slide 3 · Ai-Native MiP ───────────────────────────────────── */
.mip-h{margin:0 0 6px;font-size:30px;line-height:1.15;color:#fff}
.mip{position:relative;width:671px;height:582px;margin:0 auto}
.mip-round{position:absolute;border-radius:50%;border:3px solid rgba(255,255,255,.34)}
.mip-round.blue{width:344px;height:344px;left:0;top:0;z-index:3;background:rgba(30,77,170,.66)}
.mip-round.green{background:rgba(16,185,129,.56)}
.mip-round:nth-of-type(2){width:344px;height:344px;left:327px;top:0;z-index:2}
.mip-round:nth-of-type(3){width:300px;height:300px;left:186px;top:282px;z-index:1}
/* each round's caption + the modules inside it */
.mip-pc{position:absolute;left:38px;top:120px;width:250px;text-align:center}
.mip-pc svg{width:100%;height:auto;display:block}
.mip-pc .pc-body{fill:none;stroke:rgba(255,255,255,.55);stroke-width:5;stroke-linecap:round}
.mip-pc .pc-screen{fill:rgba(255,255,255,.08);stroke:rgba(255,255,255,.28);stroke-width:2}
.mip-pc .pc-dot{stroke:rgba(255,255,255,.35);stroke-width:2}
.mip-pc .pc-dot.blue{fill:rgba(30,77,170,.8)}
.mip-pc .pc-dot.green{fill:rgba(16,185,129,.65)}
.mip-pc .pc-wire{fill:none;stroke:rgba(243,112,33,.85);stroke-width:4;stroke-linecap:round}
.mip-pc .pc-plug{fill:var(--orange)}
.mip-pc .pc-logoring{fill:none;stroke:rgba(243,112,33,.85);stroke-width:3}
.mip-pc .pc-ui{fill:rgba(255,255,255,.28)}
.mip-pc .pc-ui.hot{fill:rgba(243,112,33,.85)}
.pc-cap{margin-top:12px;font-size:17px;font-weight:700;color:#E6ECFA;line-height:1.35}
.pc-cap span{display:block;font-size:15px;font-weight:600;color:var(--gold)}
.mip-tech{position:absolute;right:38px;top:140px;width:250px;display:flex;flex-wrap:wrap;justify-content:center;gap:18px 16px}
.mip-tech figure{margin:0;width:104px;text-align:center}
.mip-tech img{width:44px;height:44px;object-fit:contain}
.mip-tech img.mono{filter:brightness(0) invert(1);opacity:.92}
.mip-tech img.bank{width:92px;height:36px;border-radius:5px}
.mip-tech .twin{display:flex;align-items:center;justify-content:center;gap:5px}
.mip-tech .twin img{width:36px;height:36px}
.mip-tech figcaption{margin-top:7px;font-size:14px;font-weight:700;color:#E6ECFA}
.mip-arc{position:absolute;left:0;top:0;width:100%;height:100%;z-index:7;pointer-events:none}
.mip-arc text{font-family:Arial,Helvetica,sans-serif;font-weight:800;fill:#fff;letter-spacing:.01em;paint-order:stroke;stroke:rgba(5,12,30,.35);stroke-width:3px}
.mip-round:nth-of-type(3) .mip-sat{width:104px;height:104px;font-size:14px}
.mip-num{font-size:25px;font-weight:900;color:rgba(255,255,255,.75)}
.mip-sat{position:absolute;width:108px;height:108px;border-radius:50%;z-index:6;display:flex;align-items:center;justify-content:center;text-align:center;
  padding:6px;font-size:16px;font-weight:700;line-height:1.18;color:#fff;background:rgba(255,255,255,.17);border:2px solid rgba(255,255,255,.5);text-shadow:0 2px 8px rgba(5,12,30,.6)}
.mip-sat.sm{font-size:14px}
/* five modules on a ring inside the 344px round */
.mip-sat.s1{left:63px;top:65px}
.mip-sat.s2{left:173px;top:65px}
.mip-sat.s3{left:30px;top:169px}
.mip-sat.s4{left:118px;top:228px}
.mip-sat.s5{left:206px;top:169px}
/* three modules on a ring inside the 300px round */
.mip-sat.t1{left:36px;top:84px}
.mip-sat.t2{left:160px;top:84px}
.mip-sat.t3{left:98px;top:189px}
.ab-teamhead{font-size:14px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);text-align:center}
.ab-team{display:grid;grid-template-columns:repeat(4,1fr);gap:8px 6px;margin-top:8px}
.ab-team figure{margin:0;text-align:center}
.ab-team img{width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:top;border:2px solid rgba(243,112,33,.55)}
figure.t-yasomi img{object-position:50% 26%}
.ab-team figcaption{font-size:9.5px;line-height:1.2;color:#E6ECFA;margin-top:3px}
.ab-team figcaption span{display:block;color:var(--orange);font-weight:700}
</style>
<div class="deck">${S.join("\n")}</div>
<script>(function(){var m=location.search.match(/only=(\\d+)/);if(!m)return;var k=m[1];document.querySelectorAll('section.slide').forEach(function(s){if(s.id!=='s'+k)s.style.display='none';else s.style.margin='0';});document.body.style.background='#0b1020';})();</script>`;

fs.writeFileSync(OUT, html);
console.log("wrote", OUT);
console.log("slides:", n);
console.log("embedded image bytes:", (bytes / 1048576).toFixed(2), "MB");
console.log("html bytes:", (Buffer.byteLength(html) / 1048576).toFixed(2), "MB");
