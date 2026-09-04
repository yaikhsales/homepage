"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Menu } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function MobileNav({
  hideLanguages = false,
  hideLogin = false,
}: {
  hideLanguages?: boolean;
  hideLogin?: boolean;
}) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const navLinks = [
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.product"), href: "/#product" },
    { label: t("nav.customers"), href: "#customers" },
    { label: t("nav.partners"), href: "/SDTV" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: "Subscription", href: "/subscribe" },
    {
      label: "Experience",
      children: [
        { label: "Experience dashboard", href: "/experience" },
        { label: "Main platform", href: "https://main.yaikh.com/" },
      ],
    },
    { label: "Ai feed", href: "/ai-feed" },
    { label: "Chat with us", href: "#contact" },
  ];

  return (
    <>
      {/* Mobile nav — visible only on small screens */}
      <div
        className={`lg:hidden fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-md border-b border-black/5"
            : "bg-yai-navy/95 backdrop-blur-sm border-b border-white/10"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 h-20">
          {/* Logo + Slogan (matches desktop style) */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/yai-logo.jpg"
              alt="Yai"
              width={1280}
              height={1280}
              priority
              unoptimized
              className="w-12 h-12 rounded-full drop-shadow-lg shrink-0"
            />
            <span className={`leading-tight transition-colors ${
              scrolled ? "text-yai-navy" : "text-white"
            }`}>
              <span className="block font-serif font-semibold text-[13px] tracking-tight">
                {t("slogan1")}
              </span>
              <span className="block text-[10px] font-semibold tracking-tight mt-0.5">
                {t("slogan2")}
              </span>
            </span>
          </Link>

          {/* Hamburger button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition ${
              scrolled ? "text-yai-navy hover:bg-black/5" : "text-white hover:bg-white/10"
            }`}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu backdrop + drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-[38] lg:hidden"
          onClick={() => setOpen(false)}
          role="presentation"
        />
      )}

      {/* Slide-out menu */}
      <div
        className={`fixed top-20 left-0 right-0 z-[39] lg:hidden bg-yai-navy border-b border-white/20 transition-all duration-300 overflow-hidden ${
          open ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-1">
          {navLinks.map((link) => link.children ? (
            <div key={link.label}>
              <button
                type="button"
                onClick={() => setExperienceOpen((value) => !value)}
                aria-expanded={experienceOpen}
                className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-white/90 hover:text-yai-orange hover:bg-white/5 transition font-medium text-sm"
              >
                {link.label}
                <span className={`text-xs transition-transform ${experienceOpen ? "rotate-180" : ""}`}>▼</span>
              </button>
              {experienceOpen && (
                <div className="ml-4 border-l border-white/15 pl-2">
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => { setOpen(false); setExperienceOpen(false); }} className="block px-4 py-2.5 rounded-lg text-white/75 hover:text-yai-orange hover:bg-white/5 transition text-sm">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-white/90 hover:text-yai-orange hover:bg-white/5 transition font-medium text-sm"
            >
              {link.label}
            </Link>
          ))}

          {!hideLogin && (
            <a
              href="https://main.yaikh.com/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 mt-4 rounded-lg bg-yai-orange text-white hover:bg-yai-orange/90 transition font-semibold text-center text-sm"
            >
              Login · CUSTOMERS
            </a>
          )}
        </nav>
      </div>

      {/* Spacer to prevent content overlap on mobile */}
      <div className="lg:hidden h-20" />
    </>
  );
}
