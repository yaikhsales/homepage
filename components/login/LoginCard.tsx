"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function LoginCard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/plan");
      } else {
        setError(data.error || "Invalid code");
        setShake((n) => n + 1);
        inputRef.current?.select();
      }
    } catch {
      setError("Network error. Please try again.");
      setShake((n) => n + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={shake}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={
        shake > 0
          ? { opacity: 1, y: 0, scale: 1, x: [0, -10, 10, -8, 8, 0] }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={
        shake > 0
          ? { x: { duration: 0.4, ease: "easeInOut" } }
          : { duration: 0.6, ease: "easeOut" }
      }
      className="w-full max-w-md bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-8 sm:p-10"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center justify-center mb-6"
      >
        {/* Logo — falls back to a styled monogram if /images/yai-logo.png is missing */}
        <img
          src="/images/yai-logo.png"
          alt="YAI"
          className="h-16 w-auto drop-shadow-2xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            const fb = document.getElementById("logo-fallback");
            if (fb) fb.style.display = "flex";
          }}
        />
        <div
          id="logo-fallback"
          style={{ display: "none" }}
          className="items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <span className="text-yai-blue font-extrabold text-xl tracking-tight">Y</span>
          </div>
          <div className="text-white">
            <div className="font-extrabold text-2xl tracking-tight leading-none">YAI</div>
            <div className="text-xs text-white/60 mt-1">by Texlink Technologies</div>
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-white text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-2 text-balance"
      >
        Business Plan &amp; Strategy Portal
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-white/80 text-center text-sm sm:text-base mb-8"
      >
        AI-Native Manufacturing Platform for the Apparel Industry
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onSubmit={onSubmit}
        autoComplete="off"
        noValidate
      >
        <label htmlFor="access-code" className="block text-white/85 text-sm font-medium mb-2">
          Access Code
        </label>
        <input
          id="access-code"
          ref={inputRef}
          name="access-code"
          type="text"
          required
          autoComplete="off"
          spellCheck={false}
          placeholder="Enter your code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-white/12 border border-white/25 text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition text-base disabled:opacity-60"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-200"
          >
            {error}. Please contact{" "}
            <a href="mailto:gamini@yaikh.com" className="underline">
              gamini@yaikh.com
            </a>
            .
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={loading || code.trim().length === 0}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-6 w-full bg-white hover:bg-white/95 text-yai-blue font-bold py-3 rounded-lg transition shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying…" : "Enter Portal"}
        </motion.button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-white/55 text-xs text-center mt-8 leading-relaxed"
      >
        Confidential. By accessing this page you agree not to share its contents without permission.
      </motion.p>
    </motion.div>
  );
}
