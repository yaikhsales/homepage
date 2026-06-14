"use client";

import { useState } from "react";

type ImgSlot = { url: string; caption: string };
type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  a1: {
    businessRegistration: ImgSlot;
    vatCertificate:       ImgSlot;
    ictLicense:           ImgSlot;
  };
  a2: {
    frontUi:  ImgSlot;
    agentics: ImgSlot;
  };
  a3: {
    name: string;
    role: string;
    org: string;
    email: string;
    web: string;
    location: string;
  };
};

export function AboutEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const setA1 = (key: keyof Store["a1"], field: keyof ImgSlot, value: string) => {
    setStore({ ...store, a1: { ...store.a1, [key]: { ...store.a1[key], [field]: value } } });
  };
  const setA2 = (key: keyof Store["a2"], field: keyof ImgSlot, value: string) => {
    setStore({ ...store, a2: { ...store.a2, [key]: { ...store.a2[key], [field]: value } } });
  };
  const setA3 = (key: keyof Store["a3"], value: string) => {
    setStore({ ...store, a3: { ...store.a3, [key]: value } });
  };

  const save = async () => {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      const j = await r.json();
      if (j.ok) {
        setStore(j.store);
        setMsg(`✓ Saved at ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setMsg(""), 5000);
      } else {
        setMsg(`Failed: ${j.error || "unknown"}`);
      }
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* A1 — Company credentials */}
      <Section title="A1 · Company Credentials" sub="3 documents — public-facing proof of legitimacy">
        <div className="grid sm:grid-cols-3 gap-4">
          <ImageSlot label="Business Registration" url={store.a1.businessRegistration.url} caption={store.a1.businessRegistration.caption}
            onUrl={(v) => setA1("businessRegistration", "url", v)}
            onCaption={(v) => setA1("businessRegistration", "caption", v)} />
          <ImageSlot label="VAT Certificate" url={store.a1.vatCertificate.url} caption={store.a1.vatCertificate.caption}
            onUrl={(v) => setA1("vatCertificate", "url", v)}
            onCaption={(v) => setA1("vatCertificate", "caption", v)} />
          <ImageSlot label="ICT License" url={store.a1.ictLicense.url} caption={store.a1.ictLicense.caption}
            onUrl={(v) => setA1("ictLicense", "url", v)}
            onCaption={(v) => setA1("ictLicense", "caption", v)} />
        </div>
      </Section>

      {/* A2 — Product preview */}
      <Section title="A2 · Product Preview" sub="2 screenshots — show what Yai looks like">
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageSlot label="Front UI" url={store.a2.frontUi.url} caption={store.a2.frontUi.caption}
            onUrl={(v) => setA2("frontUi", "url", v)}
            onCaption={(v) => setA2("frontUi", "caption", v)} />
          <ImageSlot label="Agentics" url={store.a2.agentics.url} caption={store.a2.agentics.caption}
            onUrl={(v) => setA2("agentics", "url", v)}
            onCaption={(v) => setA2("agentics", "caption", v)} />
        </div>
      </Section>

      {/* A3 — Contact */}
      <Section title="A3 · Contact" sub="Public-facing contact block">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Name"     value={store.a3.name}     onChange={(v) => setA3("name", v)} />
          <Field label="Role"     value={store.a3.role}     onChange={(v) => setA3("role", v)} />
          <Field label="Organisation" value={store.a3.org}  onChange={(v) => setA3("org", v)} />
          <Field label="Email"    value={store.a3.email}    onChange={(v) => setA3("email", v)} />
          <Field label="Web"      value={store.a3.web}      onChange={(v) => setA3("web", v)} />
          <Field label="Location" value={store.a3.location} onChange={(v) => setA3("location", v)} />
        </div>
      </Section>

      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-gray-500">
          {store.updatedAt && (
            <>Last saved <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong> by <strong>{store.updatedBy}</strong></>
          )}
        </div>
        <div className="flex items-center gap-3">
          {msg && (
            <span className={`text-xs font-semibold ${msg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>{msg}</span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={loading}
            className="bg-yai-orange hover:bg-yai-orange-dark text-white font-extrabold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-sm"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-yai-border bg-white p-5">
      <h3 className="text-sm font-extrabold text-yai-navy uppercase tracking-wider mb-1">{title}</h3>
      {sub && <p className="text-xs text-gray-500 mb-4">{sub}</p>}
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-yai-navy border border-yai-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-yai-blue"
      />
    </label>
  );
}

function ImageSlot({
  label, url, caption, onUrl, onCaption,
}: {
  label: string; url: string; caption: string; onUrl: (v: string) => void; onCaption: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-yai-border bg-gray-50 p-3 space-y-2">
      <div className="text-[10px] uppercase tracking-wider font-extrabold text-yai-blue">{label}</div>
      <div className="aspect-[3/2] rounded bg-white border border-yai-border overflow-hidden flex items-center justify-center">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={caption} className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.3"; }} />
        ) : (
          <span className="text-[10px] text-gray-400 italic">No image · paste a URL below</span>
        )}
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => onUrl(e.target.value)}
        placeholder="https://… or /uploads/…"
        className="w-full text-[11px] font-mono text-yai-navy border border-yai-border rounded px-2 py-1 bg-white focus:outline-none focus:border-yai-blue"
      />
      <input
        type="text"
        value={caption}
        onChange={(e) => onCaption(e.target.value)}
        placeholder="Caption shown on the public plan"
        className="w-full text-[11px] text-yai-navy border border-yai-border rounded px-2 py-1 bg-white focus:outline-none focus:border-yai-blue"
      />
    </div>
  );
}
