"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Sun, Moon, ArrowRight,
    Zap, Palette, BarChart3, Users, Smartphone, Shield, Globe, Clock
} from "lucide-react";
import { useUser } from "~/hooks/api/auth";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

/* ── identical helpers from landing page ─────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.2,.8,.2,1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* ── features data ────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Zap,         tag: "builder",      title: "Lightning-fast builder",   desc: "Drop fields onto a canvas in seconds. No code, no friction — just drag, label, and publish." },
  { icon: Palette,     tag: "design",       title: "Beautiful by default",      desc: "Every form looks polished out of the box. Theme it to match your brand in a single step." },
  { icon: BarChart3,   tag: "analytics",    title: "Response analytics",        desc: "See completion rates, drop-off points, and answer distributions in real time." },
  { icon: Users,       tag: "collaboration",title: "Team workspaces",           desc: "Invite your team, assign roles, and build together without stepping on each other." },
  { icon: Smartphone,  tag: "mobile",       title: "Works on any device",       desc: "Forms render perfectly on phones, tablets, and desktops — no extra work required." },
  { icon: Shield,      tag: "security",     title: "Enterprise-grade security", desc: "HTTPS everywhere, GDPR-ready data handling, and httpOnly session cookies by default." },
  { icon: Globe,       tag: "integrations", title: "1 000+ integrations",       desc: "Push responses to Slack, Notion, Sheets, or any webhook the moment they come in." },
  { icon: Clock,       tag: "support",      title: "24 / 7 support",            desc: "Live chat, email, and a searchable knowledge base — whenever you need help." },
];

/* ── page ─────────────────────────────────────────────────────────────────── */
export default function FeaturesPage() {
  const [mode, setMode]       = useState<"dark" | "light">("dark");
  const [showModal, setShowModal] = useState(false);
  const { user }              = useUser();
  const t                     = THEMES[mode];

  return (
    <div style={{ "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", transition: "background 0.4s ease, color 0.4s ease", position: "relative", overflowX: "hidden" } as React.CSSProperties}>
      <style>{FW_CSS}</style>
      <div className="fw-bgtexture" />
      <div className="fw-glow" style={{ top: "-140px", right: "-100px" }} />

      {/* ── NAV (identical to landing) ──────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: mode === "dark" ? "rgba(10,12,15,0.75)" : "rgba(237,240,245,0.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", maxWidth: 1160, margin: "0 auto" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, fontWeight: 600, textDecoration: "none", color: "var(--ink)" }} className="fw-display">
            <span style={{ width: 11, height: 11, background: "var(--stamp)", display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
            Fieldwork
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Link href="/features" style={{ color: "var(--stamp)", textDecoration: "none", fontSize: 14.5, fontWeight: 600 }}>Features</Link>
            <Link href="/examples" style={{ color: "var(--inkSoft)", textDecoration: "none", fontSize: 14.5, fontWeight: 500 }}>Examples</Link>
            <button className="fw-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Toggle theme">
              {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {user ? (
              <Link href="/dashboard/forms" className="fw-btn-primary" style={{ background: "var(--ink)", color: "var(--bg)", padding: "9px 18px", borderRadius: 7, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Dashboard</Link>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <Link href="/signin" className="fw-btn-ghost" style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "9px 18px", borderRadius: 7, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Sign in</Link>
                <button onClick={() => setShowModal(true)} className="fw-btn-primary" style={{ background: "var(--stamp)", color: "#fff", padding: "9px 18px", borderRadius: 7, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Dashboard</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "84px 32px 60px", maxWidth: 1160, margin: "0 auto" }}>
        <div className="fw-mono" style={{ fontSize: 13, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ width: 22, height: 1, background: "var(--stamp)", display: "inline-block" }} />
          Everything included
        </div>
        <h1 className="fw-display" style={{ fontWeight: 600, fontSize: "clamp(38px, 5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.015em", margin: "0 0 24px", maxWidth: 760 }}>
          Every feature you need.<br />
          <em style={{ fontStyle: "italic", color: "var(--steel)" }}>Nothing you don't.</em>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--inkSoft)", maxWidth: 520, margin: "0 0 36px" }}>
          Fieldwork ships with a complete toolkit — builder, logic, analytics, and integrations — right out of the box.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {user ? (
            <Link href="/dashboard/forms" className="fw-btn-primary" style={{ background: "var(--stamp)", color: "#fff", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <button onClick={() => setShowModal(true)} className="fw-btn-primary" style={{ background: "var(--stamp)", color: "#fff", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Start building free <ArrowRight size={16} />
              </button>
              <Link href="/examples" className="fw-btn-ghost" style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                See examples
              </Link>
            </>
          )}
        </div>
        <div className="fw-mono" style={{ marginTop: 30, fontSize: 12.5, color: "var(--inkSoft)" }}>NO CREDIT CARD · PUBLISH IN UNDER 4 MINUTES</div>
      </section>

      {/* ── FEATURES GRID (same card style as landing field-types grid) ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "70px 32px", maxWidth: 1160, margin: "0 auto" }}>
        <Reveal>
          <div style={{ maxWidth: 560, marginBottom: 46 }}>
            <div className="fw-mono" style={{ fontSize: 13, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>The full toolkit</div>
            <h2 className="fw-display" style={{ fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 38px)", letterSpacing: "-0.01em", margin: "0 0 14px", lineHeight: 1.12 }}>
              Built for real work
            </h2>
            <p style={{ color: "var(--inkSoft)", fontSize: 16.5, lineHeight: 1.6, margin: 0 }}>
              Every feature is designed to save you time and make your forms better — not just add to a feature checklist.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const rot = [-0.8, 0.5, -0.3, 0.6, -0.5, 0.3, -0.7, 0.4][i % 8];
            return (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="fw-card" style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 9, padding: "22px 20px", transform: `rotate(${rot}deg)`, height: "100%" }}>
                  <Icon size={18} color="var(--stamp)" style={{ marginBottom: 12 }} />
                  <div className="fw-mono" style={{ fontSize: 10.5, color: "var(--stamp)", background: "var(--stampSoft)", display: "inline-block", padding: "2px 8px", borderRadius: 4, marginBottom: 14, letterSpacing: "0.03em" }}>
                    {f.tag}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--inkSoft)", lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── METRICS (identical to landing) ──────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "70px 32px", maxWidth: 1160, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, padding: "40px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
            {[
              ["4 min",    "MEDIAN TIME TO FIRST FORM"],
              ["99.98%",   "SUBMISSION UPTIME"],
              ["0",        "LINES OF CODE REQUIRED"],
              ["10,000+",  "FORMS PUBLISHED"],
            ].map(([num, label]) => (
              <div key={label}>
                <b className="fw-display" style={{ fontSize: 30, fontWeight: 600, display: "block" }}>{num}</b>
                <span className="fw-mono" style={{ fontSize: 13, color: "var(--inkSoft)" }}>{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── CTA (identical to landing) ──────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "90px 32px 100px", maxWidth: 1160, margin: "0 auto" }}>
        <Reveal>
          <div className="fw-mono" style={{ fontSize: 13, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Ready when you are</div>
          <h2 className="fw-display" style={{ fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 38px)", letterSpacing: "-0.01em", margin: "0 auto 26px", lineHeight: 1.15, maxWidth: 520 }}>
            Your first form takes four minutes.<br />The rest is just fields.
          </h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {user ? (
              <Link href="/dashboard/forms" className="fw-btn-primary" style={{ background: "var(--stamp)", color: "#fff", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Go to Dashboard →</Link>
            ) : (
              <>
                <button onClick={() => setShowModal(true)} className="fw-btn-primary" style={{ background: "var(--stamp)", color: "#fff", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer" }}>Start building free →</button>
                <Link href="/examples" className="fw-btn-ghost" style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Browse examples</Link>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER (identical to landing) ───────────────────────────────── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--line)", padding: "34px 32px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 600 }} className="fw-display">
            <span style={{ width: 10, height: 10, background: "var(--stamp)", display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
            Fieldwork
          </div>
          <div style={{ display: "flex", gap: 22, fontSize: 13.5, color: "var(--inkSoft)" }}>
            <Link href="/features" style={{ textDecoration: "none", color: "inherit" }}>Features</Link>
            <Link href="/examples" style={{ textDecoration: "none", color: "inherit" }}>Examples</Link>
            <Link href="/signin"   style={{ textDecoration: "none", color: "inherit" }}>Sign in</Link>
          </div>
          <div className="fw-mono" style={{ fontSize: 12.5, color: "var(--inkSoft)" }}>© 2026 Fieldwork</div>
        </div>
      </footer>

      {/* ── AUTH MODAL (identical to landing) ───────────────────────────── */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 420, background: t.paper, border: `1px solid ${t.line}`, borderRadius: 14, padding: "40px 36px", boxShadow: "0 30px 60px -10px rgba(0,0,0,0.5)" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 600, fontFamily: "'Fraunces', serif", color: t.ink, marginBottom: 20 }}>
                <span style={{ width: 10, height: 10, background: t.stamp, display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
                Fieldwork
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: t.ink, marginBottom: 8 }}>Get started</h2>
              <p style={{ fontSize: 14, color: t.inkSoft }}>Create an account or sign in to access your dashboard</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              <Link href="/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 20px", background: t.stamp, color: "#fff", borderRadius: 9, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                Create free account <ArrowRight size={16} />
              </Link>
              <Link href="/signin" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 20px", background: "transparent", color: t.ink, borderRadius: 9, fontWeight: 600, fontSize: 15, textDecoration: "none", border: `1px solid ${t.line}` }}>
                Sign in to your account
              </Link>
            </div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: t.inkSoft, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              No credit card · Free forever
            </p>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 18, right: 18, width: 30, height: 30, borderRadius: 6, border: `1px solid ${t.line}`, background: t.paperAlt, color: t.inkSoft, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, lineHeight: 1 }} aria-label="Close">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
