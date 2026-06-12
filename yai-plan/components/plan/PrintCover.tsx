"use client";

/**
 * Print-only cover page. Always lands on page 1 of the saved PDF.
 * Hidden on screen via .print-only.
 *
 * Forces a page break AFTER itself so the regular plan content starts on
 * page 2. Date is rendered client-side (today's local date) so the cover
 * stamps each export with when it was generated.
 */

import { useEffect, useState } from "react";

export function PrintCover() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(
      now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="print-cover">
      <div className="print-cover-inner">
        {/* Brand mark */}
        <div className="print-cover-brand">
          <div className="print-cover-logo">Yai</div>
          <div className="print-cover-tag">Strategic DTV</div>
        </div>

        {/* Title block */}
        <div className="print-cover-title">
          <div className="print-cover-flag-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/flag-cambodia.png" alt="" className="print-cover-flag" />
            <span>Made in Cambodia</span>
            <span className="print-cover-sep">·</span>
            <span>ASEAN</span>
          </div>
          <h1>Ai-Native Manufacturing Intelligence Platform</h1>
          <div className="print-cover-subtitle">Ai MIP</div>
        </div>

        {/* Footer block at bottom */}
        <div className="print-cover-foot">
          <div className="print-cover-org">Texlink Technologies Co., Ltd.</div>
          <div className="print-cover-meta">{date} · Confidential</div>
          <a href="https://www.yaikh.com" className="print-cover-web">www.yaikh.com</a>
        </div>
      </div>
    </div>
  );
}
