"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Type, Mail, ListChecks, Upload, CreditCard, CalendarClock, Sun, Moon, ArrowRight } from "lucide-react";
// import { useUser } from "~/hooks/api/auth";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
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

const FIELD_TYPES = [
  { icon: Type, tag: "text", title: "Short & long text", desc: "Names, addresses, open feedback. Set a character limit and Fieldwork enforces it as people type." },
  { icon: Mail, tag: "email · phone", title: "Contact fields", desc: "Checked against real formatting rules before submission, so you stop chasing typo'd addresses." },
  { icon: ListChecks, tag: "choice", title: "Multiple choice", desc: "Single-select, multi-select, or a dropdown when the list runs long. Reorder options by dragging." },
  { icon: Upload, tag: "upload", title: "File upload", desc: "Accept résumés, photos, or contracts with a file-type and size limit you set per field." },
  { icon: CreditCard, tag: "payment", title: "Payment collection", desc: "Take a deposit or full payment on submission. Funds land in your connected account directly." },
  { icon: CalendarClock, tag: "date · time", title: "Scheduling fields", desc: "Block out unavailable dates and let people pick a slot that's actually open." },
];

export default function HomePage() {
  const [mode, setMode]           = useState<"dark" | "light">("dark");
  const [showModal, setShowModal] = useState(false);
  const user                      = null; // Temporarily set to null
  const searchParams              = useSearchParams();
  const t                         = THEMES[mode];

  // If redirected from a protected route, open auth modal immediately
  useEffect(() => {
    if (searchParams.get("redirect")) {
      setShowModal(true);
    }
  }, [searchParams]);

  return (
    <div style={{ "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", transition: "background 0.4s ease, color 0.4s ease", position: "relative", overflowX: "hidden" } as React.CSSProperties}>
      <style>{FW_CSS}</style>
      <div className="fw-bgtexture" />
      <div className="fw-glow" style={{ top: "-140px", right: "-100px" }} />

      {/* NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: mode === "dark" ? "rgba(10,12,15,0.75)" : "rgba(237,240,245,0.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", maxWidth: 1160, margin: "0 auto" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, fontWeight: 600, textDecoration: "none", color: "var(--ink)" }} className="fw-display">
            <span style={{ width: 11, height: 11, background: "var(--stamp)", display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
            Fieldwork
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Link href="/features" style={{ color: "var(--inkSoft)", textDecoration: "none", fontSize: 14.5, fontWeight: 500 }}>Features</Link>
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

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 1, padding: "84px 32px 60px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center" }}>
          <div>
            <div className="fw-mono" style={{ fontSize: 13, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ width: 22, height: 1, background: "var(--stamp)", display: "inline-block" }} />
              No code. Just fields.
            </div>
            <h1 className="fw-display" style={{ fontWeight: 600, fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.04, letterSpacing: "-0.015em", margin: "0 0 24px" }}>
              Build forms the way<br />you'd sketch them{" "}
              <em style={{ fontStyle: "italic", color: "var(--steel)" }}>on paper</em>.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--inkSoft)", maxWidth: 460, margin: "0 0 34px" }}>
              Drop fields onto a canvas, wire up the logic between them, and publish something that feels handmade — not stamped from a template.
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
                  <Link href="/features" className="fw-btn-ghost" style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                    See how fields work
                  </Link>
                </>
              )}
            </div>
            <div className="fw-mono" style={{ marginTop: 30, fontSize: 12.5, color: "var(--inkSoft)" }}>NO CREDIT CARD · PUBLISH IN UNDER 4 MINUTES</div>
          </div>

          {/* ANIMATED FORM */}
          <div style={{ position: "relative", height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="fw-mono fw-orbit" style={{ position: "absolute", inset: -30, border: "1px dashed var(--line)", borderRadius: "50%", opacity: 0.5 }} />
            <div className="fw-mono" style={{ position: "absolute", top: "4%", left: 0, transform: "rotate(-8deg)", background: "var(--paper)", border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 6, fontSize: 11, color: "var(--inkSoft)", boxShadow: "0 8px 18px -10px rgba(0,0,0,0.3)" }}>field: email</div>
            <div className="fw-mono" style={{ position: "absolute", bottom: "8%", right: "-2%", transform: "rotate(6deg)", background: "var(--paper)", border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 6, fontSize: 11, color: "var(--inkSoft)", boxShadow: "0 8px 18px -10px rgba(0,0,0,0.3)" }}>validated ✓</div>
            <div className="fw-mono" style={{ position: "absolute", top: "40%", right: "-6%", transform: "rotate(-4deg)", background: "var(--paper)", border: "1px solid var(--line)", padding: "5px 10px", borderRadius: 6, fontSize: 11, color: "var(--inkSoft)", boxShadow: "0 8px 18px -10px rgba(0,0,0,0.3)" }}>logic: if → skip</div>
            <div style={{ position: "relative", width: 320, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "26px 24px 24px", boxShadow: "0 20px 44px -20px rgba(0,0,0,0.45)" }}>
              <div className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
                <span>Event RSVP</span><span>3 fields</span>
              </div>
              {[
                { delay: "0.3s", r: "-0.6deg", label: "Full name", tag: "text", input: <div style={{ border: "1.4px solid var(--line)", borderRadius: 6, height: 36, background: "var(--paperAlt)" }} /> },
                { delay: "1.0s", r: "0.5deg", label: "Email address", tag: "email", input: <div style={{ border: "1.4px solid var(--line)", borderRadius: 6, height: 36, background: "var(--paperAlt)" }} /> },
              ].map((f) => (
                <div key={f.label} className="fw-field-row" style={{ animationDelay: f.delay, "--r": f.r } as any}>
                  <div style={{ fontSize: 12, color: "var(--inkSoft)", marginBottom: 6, display: "flex", gap: 6, alignItems: "center" }}>
                    {f.label} <span className="fw-mono" style={{ fontSize: 9.5, background: "var(--stampSoft)", color: "var(--stamp)", padding: "1px 6px", borderRadius: 4 }}>{f.tag}</span>
                  </div>
                  {f.input}
                </div>
              ))}
              <div className="fw-field-row" style={{ animationDelay: "1.7s", "--r": "-0.4deg" } as any}>
                <div style={{ fontSize: 12, color: "var(--inkSoft)", marginBottom: 6, display: "flex", gap: 6, alignItems: "center" }}>
                  Attending? <span className="fw-mono" style={{ fontSize: 9.5, background: "var(--stampSoft)", color: "var(--stamp)", padding: "1px 6px", borderRadius: 4 }}>choice</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ border: "1.4px solid var(--line)", borderRadius: 6, padding: "7px 12px", fontSize: 12.5, color: "var(--inkSoft)", background: "var(--paperAlt)" }}>Yes, I'll be there</span>
                  <span style={{ border: "1.4px solid var(--line)", borderRadius: 6, padding: "7px 12px", fontSize: 12.5, color: "var(--inkSoft)", background: "var(--paperAlt)" }}>Can't make it</span>
                </div>
              </div>
              <div className="fw-submit" style={{ marginTop: 16, background: "var(--ink)", color: "var(--bg)", textAlign: "center", padding: 10, borderRadius: 6, fontWeight: 600, fontSize: 13.5 }}>Submit RSVP</div>
              <div className="fw-check" style={{ position: "absolute", top: -14, right: -14, width: 34, height: 34, borderRadius: "50%", background: "var(--ok)", color: mode === "dark" ? "#06110B" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: "3px solid var(--bg)" }}>✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* FIELD TYPES */}
      <section id="fields" style={{ position: "relative", zIndex: 1, padding: "70px 32px", maxWidth: 1160, margin: "0 auto" }}>
        <Reveal>
          <div style={{ maxWidth: 560, marginBottom: 46 }}>
            <div className="fw-mono" style={{ fontSize: 13, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>The field kit</div>
            <h2 className="fw-display" style={{ fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 38px)", letterSpacing: "-0.01em", margin: "0 0 14px", lineHeight: 1.12 }}>Every field, accounted for</h2>
            <p style={{ color: "var(--inkSoft)", fontSize: 16.5, lineHeight: 1.6, margin: 0 }}>Six field types cover almost anything you'd ever ask someone. Each one carries its own validation, so bad data never reaches your inbox.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {FIELD_TYPES.map((f, i) => {
            const Icon = f.icon;
            const rot = [-0.8, 0.5, -0.3, 0.6, -0.5, 0.3][i % 6];
            return (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="fw-card" style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 9, padding: "22px 20px", transform: `rotate(${rot}deg)`, height: "100%" }}>
                  <Icon size={18} color="var(--stamp)" style={{ marginBottom: 12 }} />
                  <div className="fw-mono" style={{ fontSize: 10.5, color: "var(--stamp)", background: "var(--stampSoft)", display: "inline-block", padding: "2px 8px", borderRadius: 4, marginBottom: 14, letterSpacing: "0.03em" }}>{f.tag}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--inkSoft)", lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* METRICS */}
      <section style={{ position: "relative", zIndex: 1, padding: "70px 32px", maxWidth: 1160, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, padding: "40px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
            {[["4 min","MEDIAN TIME TO FIRST FORM"],["99.98%","SUBMISSION UPTIME"],["0","LINES OF CODE REQUIRED"],["10,000+","FORMS PUBLISHED"]].map(([num, label]) => (
              <div key={label}>
                <b className="fw-display" style={{ fontSize: 30, fontWeight: 600, display: "block" }}>{num}</b>
                <span className="fw-mono" style={{ fontSize: 13, color: "var(--inkSoft)" }}>{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
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
                <Link href="/features" className="fw-btn-ghost" style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "13px 24px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>See all features</Link>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--line)", padding: "34px 32px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 600 }} className="fw-display">
            <span style={{ width: 10, height: 10, background: "var(--stamp)", display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
            Fieldwork
          </div>
          <div style={{ display: "flex", gap: 22, fontSize: 13.5, color: "var(--inkSoft)" }}>
            <Link href="/features" style={{ textDecoration: "none", color: "inherit" }}>Features</Link>
            <Link href="/examples" style={{ textDecoration: "none", color: "inherit" }}>Examples</Link>
            <Link href="/signin" style={{ textDecoration: "none", color: "inherit" }}>Sign in</Link>
          </div>
          <div className="fw-mono" style={{ fontSize: 12.5, color: "var(--inkSoft)" }}>© 2026 Fieldwork</div>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 420, background: t.paper, border: `1px solid ${t.line}`, borderRadius: 14, padding: "40px 36px", boxShadow: "0 30px 60px -10px rgba(0,0,0,0.5)" }}
          >
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 600, fontFamily: "'Fraunces', serif", color: t.ink, marginBottom: 20 }}>
                <span style={{ width: 10, height: 10, background: t.stamp, display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
                Fieldwork
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: t.ink, marginBottom: 8 }}>Get started</h2>
              <p style={{ fontSize: 14, color: t.inkSoft }}>Create an account or sign in to access your dashboard</p>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              <Link
                href={`/signup${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 20px", background: t.stamp, color: "#fff", borderRadius: 9, fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "opacity 0.2s" }}
              >
                <span>Create free account</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/signin${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 20px", background: "transparent", color: t.ink, borderRadius: 9, fontWeight: 600, fontSize: 15, textDecoration: "none", border: `1px solid ${t.line}` }}
              >
                Sign in to your account
              </Link>
            </div>

            {/* Divider note */}
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: t.inkSoft, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              No credit card · Free forever
            </p>

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: 18, right: 18, width: 30, height: 30, borderRadius: 6, border: `1px solid ${t.line}`, background: t.paperAlt, color: t.inkSoft, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, lineHeight: 1 }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
