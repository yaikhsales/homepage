"use client";

import { useEffect, useState } from "react";

/**
 * Admin panel — login + live budget editor.
 * Mounted next to the Director signature block in the Sidebar via the
 * settings-wheel ⚙️ button. Unauthenticated viewers see only the wheel;
 * clicking it opens a login form; on success, the budget editor appears.
 */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

type ActualsLine = {
  expense: (number | null)[];
  income:  (number | null)[];
  notes:   (string | null)[];
};

type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  actuals: ActualsLine;
};

const EMPTY12 = () => [null, null, null, null, null, null, null, null, null, null, null, null] as (number | null)[];
const EMPTY12_STR = () => [null, null, null, null, null, null, null, null, null, null, null, null] as (string | null)[];

export function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = unknown
  const [user, setUser] = useState<string | null>(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  // Check admin status on open
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const r = await fetch("/api/admin/auth");
        const j = await r.json();
        setIsAdmin(!!j.ok);
        setUser(j.user ?? null);
      } catch {
        setIsAdmin(false);
      }
    })();
  }, [open]);

  // Load budget data when admin is confirmed
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const r = await fetch("/api/admin/budget");
        const j: Store = await r.json();
        if (!j.actuals) {
          setStore({ updatedAt: null, updatedBy: null, actuals: { expense: EMPTY12(), income: EMPTY12(), notes: EMPTY12_STR() } });
        } else {
          setStore(j);
        }
      } catch {
        setStore({ updatedAt: null, updatedBy: null, actuals: { expense: EMPTY12(), income: EMPTY12(), notes: EMPTY12_STR() } });
      }
    })();
  }, [isAdmin]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginErr("");
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: loginUser, pass: loginPass }),
      });
      const j = await r.json();
      if (j.ok) {
        setIsAdmin(true);
        setUser(j.user);
        setLoginUser("");
        setLoginPass("");
      } else {
        setLoginErr(j.error || "Login failed");
      }
    } catch {
      setLoginErr("Network error");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAdmin(false);
    setUser(null);
  };

  const updateCell = (kind: keyof ActualsLine, i: number, value: string) => {
    if (!store) return;
    const next: Store = { ...store, actuals: { ...store.actuals } };
    if (kind === "notes") {
      const arr = [...store.actuals.notes];
      arr[i] = value || null;
      next.actuals.notes = arr;
    } else {
      const arr = [...store.actuals[kind]];
      arr[i] = value === "" ? null : Number(value);
      next.actuals[kind] = arr;
    }
    setStore(next);
  };

  const save = async () => {
    if (!store) return;
    setLoading(true);
    setSaveMsg("");
    try {
      const r = await fetch("/api/admin/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actuals: store.actuals }),
      });
      const j = await r.json();
      if (j.ok) {
        setStore(j.store);
        setSaveMsg(`✓ Saved at ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setSaveMsg(""), 4000);
      } else {
        setSaveMsg(`Failed: ${j.error || "unknown"}`);
      }
    } catch {
      setSaveMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Settings wheel button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Admin settings"
        title="Admin settings"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-yai-border bg-yai-navy text-white">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-yai-orange font-bold">
                  Admin · Texlink
                </div>
                <div className="text-base font-extrabold">
                  Live Budget — Planned vs Actual
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <span className="text-xs text-white/60">Signed in as <strong className="text-white">{user}</strong></span>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {isAdmin === null && (
                <div className="text-center text-gray-500 py-12">Checking…</div>
              )}

              {isAdmin === false && (
                <form onSubmit={login} className="max-w-sm mx-auto py-8 space-y-4">
                  <h3 className="text-lg font-extrabold text-yai-navy text-center">Admin sign in</h3>
                  <p className="text-xs text-gray-600 text-center">
                    Edit planned-vs-actual budget for the OC + DTV updates.
                  </p>
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Username"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full border border-yai-border rounded-lg px-3 py-2 text-sm text-yai-navy placeholder:text-gray-400 bg-white focus:outline-none focus:border-yai-blue"
                    required
                  />
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Passcode"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full border border-yai-border rounded-lg px-3 py-2 text-sm text-yai-navy placeholder:text-gray-400 bg-white focus:outline-none focus:border-yai-blue"
                    required
                  />
                  {loginErr && (
                    <div className="text-xs text-red-600 text-center">{loginErr}</div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yai-blue hover:bg-yai-blue-dark text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? "Signing in…" : "Sign in"}
                  </button>
                </form>
              )}

              {isAdmin === true && store && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-600 leading-snug max-w-xl">
                      Type actual amounts for each month as they post. Leave blank for months not yet
                      reported. Numbers in <strong>$ (whole dollars)</strong>. Save publishes
                      immediately to the Section 13 dashboard for all DTV viewers.
                    </p>
                    {store.updatedAt && (
                      <div className="text-[10px] text-gray-500 text-right shrink-0 ml-3">
                        Last updated<br />
                        <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong>
                        <br />by <strong>{store.updatedBy}</strong>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-yai-border">
                    <table className="w-full text-[11px] border-collapse">
                      <thead className="bg-gray-50 text-yai-navy">
                        <tr>
                          <th className="text-left px-2 py-2 font-bold uppercase tracking-wider sticky left-0 bg-gray-50">Month</th>
                          <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24">Expense $</th>
                          <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24">Income $</th>
                          <th className="text-left px-2 py-2 font-bold uppercase tracking-wider">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MONTHS.map((m, i) => (
                          <tr key={m} className="border-t border-yai-border">
                            <td className="px-2 py-1.5 font-bold text-yai-navy sticky left-0 bg-white">{m} 2026</td>
                            <td className="px-1 py-1">
                              <input
                                type="number"
                                value={store.actuals.expense[i] ?? ""}
                                onChange={(e) => updateCell("expense", i, e.target.value)}
                                placeholder="—"
                                className="w-full text-right border border-yai-border rounded px-2 py-1 text-[11px] tabular-nums text-yai-navy placeholder:text-gray-300 bg-white focus:outline-none focus:border-yai-blue"
                              />
                            </td>
                            <td className="px-1 py-1">
                              <input
                                type="number"
                                value={store.actuals.income[i] ?? ""}
                                onChange={(e) => updateCell("income", i, e.target.value)}
                                placeholder="—"
                                className="w-full text-right border border-yai-border rounded px-2 py-1 text-[11px] tabular-nums text-yai-navy placeholder:text-gray-300 bg-white focus:outline-none focus:border-yai-blue"
                              />
                            </td>
                            <td className="px-1 py-1">
                              <input
                                type="text"
                                value={store.actuals.notes[i] ?? ""}
                                onChange={(e) => updateCell("notes", i, e.target.value)}
                                placeholder="Optional note — visible to viewers"
                                className="w-full border border-yai-border rounded px-2 py-1 text-[11px] text-yai-navy placeholder:text-gray-300 bg-white focus:outline-none focus:border-yai-blue"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Excel link */}
                  <div className="mt-3 text-[11px] text-gray-600">
                    Source spreadsheet:{" "}
                    <a
                      href="https://docs.google.com/spreadsheets/d/1So4r5y8fMWaTYbGt9RSnGWyvOPTykU-3/edit?usp=sharing&ouid=117782760352758034052&rtpof=true&sd=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yai-blue font-bold underline decoration-dotted"
                    >
                      TEXLINK Budget 2026 (Google Sheets) ↗
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {isAdmin === true && (
              <div className="flex items-center justify-between gap-3 p-4 border-t border-yai-border bg-gray-50">
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-gray-500 hover:text-yai-navy"
                >
                  Sign out
                </button>
                <div className="flex items-center gap-3">
                  {saveMsg && (
                    <span className={`text-xs font-semibold ${saveMsg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>
                      {saveMsg}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={save}
                    disabled={loading}
                    className="bg-yai-orange hover:bg-yai-orange-dark text-white font-bold px-5 py-2 rounded-lg transition disabled:opacity-50 text-sm"
                  >
                    {loading ? "Saving…" : "Save & publish"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
