"use client";

import { useState } from "react";
import Link from "next/link";
import { Sun, Moon, ArrowLeft, Mail } from "lucide-react";
import { Input } from "~/components/ui/input";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

export default function ForgotPasswordPage() {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = THEMES[mode];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" } as React.CSSProperties}>
      <style>{FW_CSS}</style>
      <div className="fw-bgtexture" />

      <button className="fw-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ position: "absolute", top: 20, right: 20, width: 34, height: 34, borderRadius: 8, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
        {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <Link href="/signin" className="fw-btn-ghost" style={{ position: "absolute", top: 20, left: 20, padding: "8px 14px", border: "1px solid var(--line)", borderRadius: 7, textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, zIndex: 10 }}>
        <ArrowLeft size={14} /> Back
      </Link>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "40px 36px", boxShadow: "0 20px 44px -20px rgba(0,0,0,0.35)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 600, marginBottom: 20 }} className="fw-display">
            <span style={{ width: 10, height: 10, background: "var(--stamp)", display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
            Fieldwork
          </div>
          <div style={{ width: 56, height: 56, margin: "0 auto 18px", borderRadius: "50%", background: "var(--stampSoft)", color: "var(--stamp)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={26} />
          </div>
          {!sent ? (
            <>
              <h1 className="fw-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Forgot password?</h1>
              <p style={{ fontSize: 14, color: "var(--inkSoft)" }}>Enter your email and we'll send reset instructions</p>
            </>
          ) : (
            <>
              <h1 className="fw-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Check your email</h1>
              <p style={{ fontSize: 14, color: "var(--inkSoft)", marginBottom: 8 }}>We sent a reset link to</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{email}</p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Email Address</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", padding: "12px 14px", fontSize: 15 }} />
            </div>
            <button type="submit" disabled={loading} className="fw-btn-primary" style={{ width: "100%", padding: "13px 20px", background: loading ? "var(--inkSoft)" : "var(--stamp)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ padding: "14px 16px", background: "var(--paperAlt)", border: "1px solid var(--line)", borderRadius: 8, marginBottom: 20, fontSize: 13, color: "var(--inkSoft)" }}>
              <strong style={{ color: "var(--ink)" }}>Didn't receive it?</strong> Check spam or{" "}
              <button onClick={() => setSent(false)} style={{ color: "var(--stamp)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0 }}>try another address</button>
            </div>
            <Link href="/signin" className="fw-btn-ghost" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 20px", border: "1px solid var(--line)", borderRadius: 8, textDecoration: "none", color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
