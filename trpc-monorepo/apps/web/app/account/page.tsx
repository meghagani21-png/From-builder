"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, Moon, User, Mail, LogOut, Shield } from "lucide-react";
import { useUser, useSignout } from "~/hooks/api/auth";
import { Input } from "~/components/ui/input";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

export default function AccountPage() {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const { user, isLoading } = useUser();
  const { signOutAsync, isPending: signingOut } = useSignout();
  const router = useRouter();
  const t = THEMES[mode];

  const handleSignout = async () => {
    await signOutAsync({});
    router.push("/");
  };

  return (
    <div style={{ "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: "relative" } as React.CSSProperties}>
      <style>{FW_CSS}</style>
      <div className="fw-bgtexture" />

      {/* NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: mode === "dark" ? "rgba(10,12,15,0.75)" : "rgba(237,240,245,0.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/dashboard/forms" className="fw-btn-ghost" style={{ padding: "8px 14px", border: "1px solid var(--line)", borderRadius: 7, textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <span className="fw-display" style={{ fontSize: 18, fontWeight: 600 }}>Account Settings</span>
          </div>
          <button className="fw-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Toggle theme">
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </header>

      <main style={{ position: "relative", zIndex: 1, padding: "48px 32px", maxWidth: 640, margin: "0 auto" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <span className="fw-mono" style={{ fontSize: 13, color: "var(--inkSoft)" }}>Loading…</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Profile card */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--stampSoft)", color: "var(--stamp)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, fontFamily: "'Fraunces', serif" }}>
                  {(user?.fullName ?? user?.email ?? "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="fw-display" style={{ fontSize: 20, fontWeight: 600 }}>{user?.fullName || "User"}</div>
                  <div className="fw-mono" style={{ fontSize: 12, color: "var(--inkSoft)" }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                    <User size={11} style={{ display: "inline", marginRight: 5 }} />
                    Full Name
                  </label>
                  <Input
                    defaultValue={user?.fullName || ""}
                    disabled
                    style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", opacity: 0.7 }}
                  />
                </div>
                <div>
                  <label className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                    <Mail size={11} style={{ display: "inline", marginRight: 5 }} />
                    Email Address
                  </label>
                  <Input
                    defaultValue={user?.email || ""}
                    disabled
                    style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", opacity: 0.7 }}
                  />
                </div>
                <div style={{ padding: "10px 14px", background: "var(--paperAlt)", border: "1px solid var(--line)", borderRadius: 8, fontSize: 12, color: "var(--inkSoft)" }}>
                  Profile editing coming soon. Contact support to update your details.
                </div>
              </div>
            </div>

            {/* Password card */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Shield size={16} color="var(--stamp)" />
                <span className="fw-display" style={{ fontSize: 17, fontWeight: 600 }}>Password & Security</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--inkSoft)", marginBottom: 16, lineHeight: 1.6 }}>
                To change your password, use the forgot password flow from the sign-in page.
              </p>
              <Link href="/forgot-password" className="fw-btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "1px solid var(--line)", borderRadius: 7, textDecoration: "none", color: "var(--ink)", fontWeight: 600, fontSize: 13 }}>
                Reset Password
              </Link>
            </div>

            {/* Danger zone */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: 28 }}>
              <div className="fw-mono" style={{ fontSize: 11, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Danger Zone</div>
              <p style={{ fontSize: 14, color: "var(--inkSoft)", marginBottom: 16 }}>
                Sign out from your account on this device.
              </p>
              <button
                onClick={handleSignout}
                disabled={signingOut}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "transparent", border: "1px solid var(--stamp)", borderRadius: 7, color: "var(--stamp)", cursor: signingOut ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13 }}
              >
                <LogOut size={14} />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
