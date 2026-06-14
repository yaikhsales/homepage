"use client";

/**
 * Print-only end page (last sheet of the saved PDF).
 * Contact details + clickable www.yaikh.com link + Texlink Technologies block.
 *
 * Forces a page break BEFORE itself so it always lands on its own clean sheet.
 * Hidden on screen via .print-only.
 */

import type { AboutStore } from "@/lib/about-store";

export function PrintEndPage({ about }: { about: AboutStore }) {
  const a3 = about.a3;
  const web = a3.web?.replace(/^https?:\/\//, "") || "www.yaikh.com";
  const webHref = a3.web?.startsWith("http") ? a3.web : `https://${web}`;

  return (
    <div className="print-end">
      <div className="print-end-inner">
        <div className="print-end-brand">
          <div className="print-end-logo">Yai</div>
          <div className="print-end-tag">Strategic DTV</div>
        </div>

        <div className="print-end-divider" />

        <h2>Contact</h2>

        <div className="print-end-contact">
          <div className="print-end-name">{a3.name}</div>
          <div className="print-end-role">{a3.role} · {a3.org}</div>

          <dl>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${a3.email}`}>{a3.email}</a>
            </dd>
            <dt>Web</dt>
            <dd>
              <a href={webHref} target="_blank" rel="noopener noreferrer">{web}</a>
            </dd>
            <dt>Location</dt>
            <dd>{a3.location}</dd>
          </dl>
        </div>

        <div className="print-end-divider" />

        <div className="print-end-org">
          <div className="print-end-org-name">Texlink Technologies Co., Ltd.</div>
          <p>
            Yai · Ai-Native Manufacturing Intelligence Platform.<br />
            Designed in Cambodia, built for ASEAN apparel manufacturing.
          </p>
        </div>

        <a href={webHref} className="print-end-web">www.yaikh.com</a>

        <div className="print-end-foot">
          Confidential — by accessing this document you agree not to share
          its contents without permission.
        </div>
      </div>
    </div>
  );
}
