/* Shared site footer — home page and /subscribe both render this, so the
 * company details and the ABA-required "We accept" strip stay in one place.
 * No hooks: renders on the server in both trees. Section links are absolute
 * (`/#product`) so they resolve from any route, not just the home page. */
import Image from "next/image";

// Paste the official WhatsApp chat URL here when it is ready.
const WHATSAPP_URL = "";

export default function SiteFooter() {
  return (
    <footer className="bg-yai-navy text-white/60 text-sm">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <Image
            src="/images/yai-logo.jpg"
            alt="Yai"
            width={1280}
            height={1280}
            unoptimized
            className="w-20 h-20 rounded-full drop-shadow-2xl"
          />
          <p className="mt-4 text-[12.5px] leading-relaxed text-white/55">
            <span className="text-white/75 font-semibold">Texlink Technologies Co., Ltd.</span><br />
            <span className="text-white/55">Reg. 1000542518 · 03 Oct 2025</span><br />
            TSF-038A Kolap Street, Damnak Village,<br />
            Sen Sok, Phnom Penh, Cambodia.<br />
            <span className="italic text-white/65">Ai-Native Manufacturing Intelligence Platform.</span>
          </p>
          {/* Social — LinkedIn / Facebook / YouTube / TikTok / Telegram / WhatsApp. */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/texlinkai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Yai on LinkedIn"
              className="text-white/70 hover:text-[#0A66C2] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
            <a
              href="https://web.facebook.com/people/Yai/61568598089619/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Yai on Facebook"
              className="text-white/70 hover:text-[#1877F2] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.438H7.078v-3.489h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.973h-1.513c-1.49 0-1.956.931-1.956 1.887v2.26h3.328l-.532 3.489h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@yaikh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Yai on YouTube"
              className="text-white/70 hover:text-[#FF0000] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.45 12 20.45 12 20.45s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@yaikh2025"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Yai on TikTok"
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M16.6 5.82a4.28 4.28 0 0 1-1.01-2.82h-3.3v12.86a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.59 2.59 2.59 0 0 1 3.39-2.46V9.94a5.99 5.99 0 0 0-.8-.05 5.92 5.92 0 1 0 5.92 5.92V9.01a7.57 7.57 0 0 0 4.43 1.42V7.13a4.28 4.28 0 0 1-3.46-1.31z" />
              </svg>
            </a>
            <a
              href="https://t.me/TEXLINLdotLTD"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Yai on Telegram"
              className="text-white/70 hover:text-[#2AABEE] transition-colors"
            >
              <svg viewBox="0 0 496 512" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm114 169-41 193c-3 14-12 17-24 11l-62-46-30 29c-3 3-6 6-13 6l5-63 115-104c5-4-1-7-8-3l-142 90-61-20c-13-4-14-13 3-20l239-92c11-4 21 3 17 19z" />
              </svg>
            </a>
            {WHATSAPP_URL ? (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yai on WhatsApp"
                className="text-white/70 hover:text-[#25D366] transition-colors"
              >
                <WhatsAppIcon />
              </a>
            ) : (
              <span aria-label="Yai on WhatsApp — link coming soon" title="Add WHATSAPP_URL in site-footer.tsx" className="text-white/35">
                <WhatsAppIcon />
              </span>
            )}
          </div>
        </div>
        <FooterCol title="Product">
          <FooterLink href="/#product">The platform</FooterLink>
          <FooterLink href="/#pricing">Pricing</FooterLink>
          <FooterLink href="/#customers">Customers</FooterLink>
        </FooterCol>
        <FooterCol title="Partners">
          <FooterLink href="/#partners">Anthropic</FooterLink>
          <FooterLink href="/#partners">Google Cloud</FooterLink>
          <FooterLink href="/#impact">JICA · Impact</FooterLink>
        </FooterCol>
        <FooterCol title="Company">
          <FooterLink href="mailto:gamini@yaikh.com">Contact</FooterLink>
          <FooterLink href="/SDTV">Strategic DTV portal</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between text-[11.5px] text-white/45">
          <span>© {new Date().getFullYear()} Texlink Technologies Co., Ltd. · Made in Cambodia · www.yaikh.com</span>
          <div className="flex items-center gap-2.5 sm:ml-auto">
            <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-white/60 shrink-0">We accept</span>
            <PaymentStrip />
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1z" />
      <path d="M8.2 7.8c.2-.4.4-.4.7-.4h.4c.1 0 .3 0 .4.4l.8 1.9c.1.3 0 .5-.2.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.6 2.1 2.8 2.8.2.1.4.2.6 0l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .3-.2 1.5-1 2-.7.5-1.5.7-2.5.4-1.1-.3-2.5-.9-4.2-2.4-1.4-1.3-2.4-2.8-2.7-3.9-.4-1.1 0-2.4.5-3z" />
    </svg>
  );
}

/* ABA-required "We accept" strip. Each brand SVG carries its own tile, so the
 * logos sit directly on the footer — no wrapper background. */
export function PaymentStrip() {
  const brands = [
    { src: "/brand/aba.svg", alt: "ABA" },
    { src: "/brand/khqr.svg", alt: "KHQR" },
    // ponytail: card brands hidden until card payment is live — re-add when accepted.
    // { src: "/brand/visa.svg", alt: "Visa" },
    // { src: "/brand/mastercard.svg", alt: "Mastercard" },
    // { src: "/brand/unionpay.svg", alt: "UnionPay" },
    // { src: "/brand/jcb.svg", alt: "JCB" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {brands.map((b) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={b.alt} src={b.src} alt={b.alt} className="h-5 w-auto block rounded-[3px]" />
      ))}
    </div>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/85 mb-3">{title}</div>
      <ul className="space-y-2 text-[13px]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="hover:text-yai-amber transition">
        {children}
      </a>
    </li>
  );
}
