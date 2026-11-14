import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./ExperienceCover.css";

/* Presentation cover for /experience.
 *
 * Sits in FRONT of the working dashboard and changes nothing behind it —
 * dismissing it drops straight into the board as before.
 *
 * The six points change for every audience, so they are not baked into the
 * bundle: editing them must never need a rebuild and a Cloudflare publish.
 * Three ways in, cheapest first:
 *   1. "Edit points" on the cover itself — typed in, kept in localStorage,
 *      so the laptop that presents remembers its own set.
 *   2. ?p1=…&p2=… on the URL — a link per audience, nothing to set up.
 *      Params win over stored text and are saved as the new set.
 *   3. The defaults below, used when neither of the above says otherwise.
 *
 * Shown once per browser session. ?cover=1 forces it back, ?cover=0 skips it.
 */

const STORE_KEY = "yai-cover-points-v1";
const SEEN_KEY = "yai-cover-seen-v1";
const SLOTS = 6;
const DEFAULT_POINTS = ["Yai & Texlink", "", "", "", "", ""];

function readStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return Array.from({ length: SLOTS }, (_, i) => (typeof parsed[i] === "string" ? parsed[i] : ""));
  } catch {
    return null;
  }
}

function readParams(search) {
  const params = new URLSearchParams(search);
  let any = false;
  const points = Array.from({ length: SLOTS }, (_, i) => {
    const value = params.get(`p${i + 1}`);
    if (value === null) return "";
    any = true;
    return value.slice(0, 80);
  });
  return any ? points : null;
}

export default function ExperienceCover() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [points, setPoints] = useState(DEFAULT_POINTS);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const forced = params.get("cover");

    const fromUrl = readParams(search);
    const stored = readStored();
    const next = fromUrl || stored || DEFAULT_POINTS;
    setPoints(next);
    if (fromUrl) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(fromUrl)); } catch { /* private window */ }
    }

    if (forced === "0") return;
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* private window */ }
    if (forced === "1" || !seen) setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    if (editing) return;
    setLeaving(true);
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* private window */ }
    setTimeout(() => { setVisible(false); setLeaving(false); }, 420);
  }, [editing]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event) => {
      if (event.key === "Escape" && !editing) dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, editing, dismiss]);

  const setPoint = (index, value) =>
    setPoints((current) => {
      const next = [...current];
      next[index] = value.slice(0, 80);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* private window */ }
      return next;
    });

  if (!visible) return null;

  /* Portalled to <body>: mounted inside the dashboard tree an ancestor
     transform makes a stacking context and the overlay renders behind
     the module tiles no matter how high its z-index is. */
  return createPortal(
    <div className={`yai-cover ${leaving ? "is-leaving" : ""}`} role="dialog" aria-label="Presentation cover">
      <div className="yai-cover-head">
        <span className="yai-cover-mark" aria-hidden="true">Yai</span>
        <div>
          <h1 className="yai-cover-title">
            Ai-Native <em>Manufacturing</em> Intelligence Platform
          </h1>
          <p className="yai-cover-site">www.yaikh.com</p>
        </div>
      </div>

      <ol className="yai-cover-points">
        {points.map((text, index) => (
          <li key={index} className={`yai-cover-point ${text ? "" : "is-empty"}`}>
            <span className="yai-cover-num" aria-hidden="true">{index + 1}</span>
            {editing ? (
              <input
                value={text}
                onChange={(event) => setPoint(index, event.target.value)}
                placeholder={`Point ${index + 1}`}
                aria-label={`Point ${index + 1}`}
                maxLength={80}
                className="yai-cover-input"
              />
            ) : (
              <span className="yai-cover-text">{text}</span>
            )}
          </li>
        ))}
      </ol>

      <div className="yai-cover-actions">
        {editing ? (
          <>
            <button type="button" className="yai-cover-btn is-primary" onClick={() => setEditing(false)}>Done</button>
            <button
              type="button"
              className="yai-cover-btn"
              onClick={() => { setPoints(DEFAULT_POINTS); try { localStorage.removeItem(STORE_KEY); } catch { /* private window */ } }}
            >
              Clear all
            </button>
          </>
        ) : (
          <>
            <button type="button" className="yai-cover-btn is-primary" onClick={dismiss}>Enter the platform →</button>
            <button type="button" className="yai-cover-btn" onClick={() => setEditing(true)}>Edit points</button>
          </>
        )}
      </div>

      <div className="yai-cover-wedge" aria-hidden="true" />
    </div>,
    document.body
  );
}
