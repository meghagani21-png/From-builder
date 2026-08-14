"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useSignin } from "~/hooks/api/auth";
import { Input } from "~/components/ui/input";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

export default function SigninPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { signInUserWithEmailAndPasswordAsync, isPending, error } = useSignin();
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = THEMES[mode];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInUserWithEmailAndPasswordAsync({ email, password });
    const redirect = searchParams.get("redirect");
    router.push(redirect || "/dashboard/forms");
  };

  return (
    <div style={{ "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" } as React.CSSProperties}>
      <style>{FW_CSS}</style>
      <div className="fw-bgtexture" />
      <div className="fw-glow" style={{ top: "-200px", left: "-100px" }} />

      <button className="fw-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ position: "absolute", top: 20, right: 20, width: 34, height: 34, borderRadius: 8, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
        {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <Link href="/" className="fw-btn-ghost" style={{ position: "absolute", top: 20, left: 20, padding: "8px 14px", border: "1px solid var(--line)", borderRadius: 7, textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, zIndex: 10 }}>
        <ArrowLeft size={14} /> Back
      </Link>

      <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "40px 36px", boxShadow: "0 20px 44px -20px rgba(0,0,0,0.35)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 600, marginBottom: 20 }} className="fw-display">
            <span style={{ width: 10, height: 10, background: "var(--stamp)", display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
            Fieldwork
          </div>
          <h1 className="fw-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "var(--inkSoft)" }}>Sign in to continue building</p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Email Address</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", padding: "12px 14px", fontSize: 15 }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", padding: "12px 14px", fontSize: 15 }} />
        </div>

        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--stamp)", textDecoration: "none", fontWeight: 500 }}>Forgot password?</Link>
        </div>

        {error && <div style={{ padding: 12, background: "var(--stampSoft)", border: "1px solid var(--stamp)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "var(--stamp)" }}>{error.message}</div>}

        <button type="submit" disabled={isPending} className="fw-btn-primary" style={{ width: "100%", padding: "13px 20px", background: isPending ? "var(--inkSoft)" : "var(--stamp)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: isPending ? "not-allowed" : "pointer", marginBottom: 20 }}>
          {isPending ? "Signing in…" : "Sign in"}
        </button>

        <div style={{ textAlign: "center", paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <span style={{ fontSize: 14, color: "var(--inkSoft)" }}>No account? </span>
          <Link href="/signup" style={{ fontSize: 14, color: "var(--stamp)", textDecoration: "none", fontWeight: 600 }}>Sign up free</Link>
        </div>
      </form>
    </div>
  );
}
