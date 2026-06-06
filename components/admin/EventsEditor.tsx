"use client";

import { useState } from "react";

type EventAlbum = {
  id: string;
  date: string;
  title: string;
  description: string;
  category?: string;
  photos: string[];
  pinned?: boolean;
};

type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  albums: EventAlbum[];
};

const CATEGORIES = ["Government", "Partnership", "Conference", "Demo", "Press", "Team", "Other"];

const CAT_COLOR: Record<string, string> = {
  Government: "#1E4DAA",
  Partnership: "#8B5CF6",
  Conference: "#F37021",
  Demo: "#10B981",
  Press: "#EF4444",
  Team: "#14B8A6",
  Other: "#94A3B8",
};

export function EventsEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const update = (idx: number, patch: Partial<EventAlbum>) => {
    setStore({
      ...store,
      albums: store.albums.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    });
  };

  const remove = (idx: number) => {
    if (!confirm(`Delete "${store.albums[idx]?.title}" album?`)) return;
    setStore({ ...store, albums: store.albums.filter((_, i) => i !== idx) });
  };

  const addAlbum = () => {
    const today = new Date().toISOString().slice(0, 10);
    setStore({
      ...store,
      albums: [
        {
          id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          date: today,
          title: "New event",
          description: "",
          category: "Other",
          photos: [],
          pinned: false,
        },
        ...store.albums,
      ],
    });
  };

  const addPhoto = (idx: number) => {
    const url = prompt("Paste photo URL (https://… or /uploads/…)");
    if (!url) return;
    update(idx, { photos: [...store.albums[idx].photos, url.trim()] });
  };

  const removePhoto = (idx: number, photoIdx: number) => {
    update(idx, { photos: store.albums[idx].photos.filter((_, j) => j !== photoIdx) });
  };

  const save = async () => {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/events", {
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
    <div className="space-y-4">
      {/* Status row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Albums" value={`${store.albums.length}`} />
          <Stat
            label="Photos total"
            value={`${store.albums.reduce((s, a) => s + a.photos.length, 0)}`}
            color="#10B981"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addAlbum}
            className="text-xs bg-yai-blue hover:bg-yai-blue-dark text-white font-extrabold px-3 py-1.5 rounded-lg"
          >
            + New event album
          </button>
        </div>
      </div>

      {/* Album cards */}
      <div className="grid gap-3">
        {store.albums.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm bg-white border border-yai-border rounded-xl">
            No events yet. Click <strong>+ New event album</strong> to add the first one.
          </div>
        )}

        {store.albums.map((a, i) => {
          const catColor = CAT_COLOR[a.category || "Other"] || "#94A3B8";
          return (
            <div
              key={a.id}
              className="rounded-xl border border-yai-border bg-white overflow-hidden shadow-sm"
              style={{ boxShadow: `inset 4px 0 0 0 ${catColor}` }}
            >
              <div className="p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="date"
                    value={a.date}
                    onChange={(e) => update(i, { date: e.target.value })}
                    className="text-xs tabular-nums text-yai-navy border border-yai-border rounded px-2 py-1 bg-white focus:outline-none focus:border-yai-blue"
                  />
                  <select
                    value={a.category || "Other"}
                    onChange={(e) => update(i, { category: e.target.value })}
                    className="text-[10px] uppercase tracking-wider font-extrabold border rounded px-1.5 py-1 bg-white"
                    style={{ color: catColor, borderColor: catColor }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1 text-[11px] text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!a.pinned}
                      onChange={(e) => update(i, { pinned: e.target.checked })}
                    />
                    📌 Pin to top
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="ml-auto text-gray-400 hover:text-red-500 text-sm"
                    title="Delete album"
                  >
                    × Delete
                  </button>
                </div>

                {/* Title */}
                <input
                  type="text"
                  value={a.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                  placeholder="Event title — e.g. Minister of Environment presentation"
                  className="w-full text-lg font-extrabold text-yai-navy bg-transparent border-0 border-b border-yai-border focus:outline-none focus:border-yai-blue px-1 py-1"
                />

                {/* Description */}
                <textarea
                  value={a.description}
                  onChange={(e) => update(i, { description: e.target.value })}
                  placeholder="What happened, who attended, outcomes..."
                  rows={3}
                  className="w-full text-sm text-yai-navy border border-yai-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-yai-blue resize-vertical"
                />

                {/* Photos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                      Photos ({a.photos.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => addPhoto(i)}
                      className="text-[11px] bg-white border border-yai-border hover:bg-blue-50 px-2 py-1 rounded font-bold text-yai-navy"
                    >
                      + Photo URL
                    </button>
                  </div>
                  {a.photos.length === 0 ? (
                    <div className="text-[11px] text-gray-400 italic py-2">
                      No photos yet — click + Photo URL to add (paste a https:// link or /uploads/… path)
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {a.photos.map((url, pi) => (
                        <div key={pi} className="relative group rounded-lg overflow-hidden border border-yai-border bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt=""
                            className="w-full h-28 object-cover"
                            onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(i, pi)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                            title="Remove photo"
                          >
                            ×
                          </button>
                          <div className="px-1.5 py-1 text-[9px] text-gray-500 truncate font-mono" title={url}>
                            {url}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-[11px] text-gray-500">
          {store.updatedAt && (
            <>
              Last saved <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong> by{" "}
              <strong>{store.updatedBy}</strong>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {msg && (
            <span className={`text-xs font-semibold ${msg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>
              {msg}
            </span>
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

function Stat({ label, value, color = "#0A1F47" }: { label: string; value: string; color?: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">{label}</span>
      <span className="font-extrabold tabular-nums" style={{ color }}>
        {value}
      </span>
    </span>
  );
}
