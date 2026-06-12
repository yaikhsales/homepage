"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "", pass }),
      });
      const j = await r.json();
      if (j.ok) {
        router.refresh();
      } else {
        setErr(j.error || "Incorrect passcode");
      }
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password"
        autoComplete="current-password"
        autoFocus
        placeholder="Passcode"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="w-full border border-yai-border rounded-lg px-3 py-2.5 text-sm text-yai-navy placeholder:text-gray-400 bg-white focus:outline-none focus:border-yai-blue"
        required
      />
      {err && <div className="text-xs text-red-600 text-center">{err}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yai-blue hover:bg-yai-blue-dark text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
