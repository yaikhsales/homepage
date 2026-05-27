"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MadeInCambodia } from "@/components/plan/MadeInCambodia";

export function LoginCard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const [reveal, setReveal] = useState(false);
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
        <img
          src="/images/yai-logo.jpg"
          alt="Yai"
          className="h-32 sm:h-36 w-auto rounded-lg shadow-2xl"
        />
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
        className="text-white/85 text-center text-sm sm:text-base mb-3"
      >
        Ai-Native Manufacturing Intelligence Platform
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-extrabold tracking-[0.18em] uppercase">
          Ai MIP
        </span>
        <span className="text-white/30 text-xs">·</span>
        <MadeInCambodia variant="dark" />
      </motion.div>

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
        <div className="relative">
          <input
            id="access-code"
            ref={inputRef}
            name="access-code"
            type={reveal ? "text" : "password"}
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            className="w-full pl-4 pr-12 py-3 rounded-lg bg-white border border-white/40 text-yai-blue-deep font-medium placeholder-yai-blue-deep/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition text-base disabled:opacity-60 tracking-wide"
          />
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            tabIndex={-1}
            aria-label={reveal ? "Hide code" : "Show code"}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-yai-blue-deep/50 hover:text-yai-blue-deep transition"
          >
            {reveal ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

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
