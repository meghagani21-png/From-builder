"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Plus, 
    Eye, 
    PencilLine, 
    Calendar,
    MoreVertical,
    ExternalLink,
    Trash2,
    Users,
    TrendingUp,
    Clock,
    Sun,
    Moon,
    LogOut,
    Copy,
    Link2,
} from "lucide-react";

import { useCreateForm, useListForms, useDeleteForm, useUpdateForm } from "~/hooks/api/form";
import { useSignout, useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { THEMES, FW_CSS } from "~/lib/fieldwork";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

function CreateFormDialog({ 
    open, 
    onOpenChange,
    mode = "dark"
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void;
    mode?: "dark" | "light";
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { createFormAsync, error, status } = useCreateForm();
    const t = THEMES[mode];

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await createFormAsync({
            title: title.trim(),
            description: description.trim() || undefined,
        });
        onOpenChange(false);
        setTitle("");
        setDescription("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent style={{ 
                background: t.paper, 
                border: `1px solid ${t.line}`, 
                color: t.ink,
                maxWidth: 500
            }}>
                <DialogHeader>
                    <DialogTitle className="fw-display" style={{ fontSize: 22, color: t.ink, marginBottom: 20 }}>
                        Create New Form
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="fw-mono" style={{ fontSize: 11, color: t.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Form Title
                        </label>
                        <Input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="e.g., Customer Feedback Survey"
                            style={{ background: t.paperAlt, border: `1px solid ${t.line}`, color: t.ink }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="fw-mono" style={{ fontSize: 11, color: t.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Description (Optional)
                        </label>
                        <Textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Brief description of what this form is for..."
                            style={{ background: t.paperAlt, border: `1px solid ${t.line}`, color: t.ink, minHeight: "80px" }}
                        />
                    </div>

                    {error && (
                        <div style={{ padding: "12px", background: "rgba(255,110,66,0.1)", border: `1px solid ${t.stamp}`, borderRadius: 8 }}>
                            <p style={{ fontSize: 14, color: t.stamp, margin: 0 }}>{error.message}</p>
                        </div>
                    )}

                    <div style={{ marginTop: 24, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="fw-btn-ghost"
                            style={{ border: `1px solid ${t.line}`, color: t.ink, padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, background: "transparent", cursor: "pointer" }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={status === "pending" || title.trim().length === 0}
                            className="fw-btn-primary"
                            style={{ background: t.stamp, color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: status === "pending" || title.trim().length === 0 ? "not-allowed" : "pointer", opacity: status === "pending" || title.trim().length === 0 ? 0.5 : 1 }}
                        >
                            {status === "pending" ? "Creating..." : "Create Form"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function DashboardForms() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"dark" | "light">("dark");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const { forms, isLoading } = useListForms();
    const { user } = useUser();
    const { signOutAsync, isPending: signingOut } = useSignout();
    const { deleteFormAsync } = useDeleteForm();
    const { createFormAsync } = useCreateForm();
    const router = useRouter();
    const t = THEMES[mode];

    const handleSignout = async () => {
        await signOutAsync({});
        router.push("/");
    };

    const handleDelete = async (formId: string, title: string) => {
        if (!confirm(`Delete "${title}"? This will also delete all fields and responses. This cannot be undone.`)) return;
        await deleteFormAsync({ formId });
    };

    const handleDuplicate = async (srcFormId: string, title: string) => {
        await createFormAsync({ title: `${title} (copy)` });
    };

    const handleCopyLink = (formId: string) => {
        const url = `${window.location.origin}/form/${formId}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url);
        } else {
            // fallback for non-HTTPS or unsupported browsers
            const el = document.createElement("textarea");
            el.value = url;
            el.style.position = "fixed";
            el.style.opacity = "0";
            document.body.appendChild(el);
            el.focus();
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        setCopiedId(formId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div
            style={{
                // @ts-ignore
                "--bg": t.bg,
                "--paper": t.paper,
                "--paperAlt": t.paperAlt,
                "--ink": t.ink,
                "--inkSoft": t.inkSoft,
                "--steel": t.steel,
                "--stamp": t.stamp,
                "--stampSoft": t.stampSoft,
                "--line": t.line,
                "--ok": t.ok,
                "--gridLine": t.gridLine,
                background: "var(--bg)",
                color: "var(--ink)",
                minHeight: "100vh",
                fontFamily: "'Inter', sans-serif",
                transition: "background 0.4s ease, color 0.4s ease",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
                .fw-display{ font-family:'Fraunces', serif; }
                .fw-mono{ font-family:'IBM Plex Mono', monospace; }
                .fw-bgtexture{
                    position:absolute; inset:0; pointer-events:none; z-index:0;
                    background-image: linear-gradient(var(--gridLine) 1px, transparent 1px), linear-gradient(90deg, var(--gridLine) 1px, transparent 1px);
                    background-size: 42px 42px;
                }
                .fw-card{ transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
                .fw-card:hover{ transform: translateY(-4px); border-color: var(--stamp); }
                .fw-btn-primary{ transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease; }
                .fw-btn-primary:hover{ transform: translateY(-2px); box-shadow: 0 10px 24px -10px var(--stampSoft); }
                .fw-btn-ghost{ transition: border-color 0.2s ease, color 0.2s ease, transform 0.15s ease; }
                .fw-btn-ghost:hover{ transform: translateY(-2px); border-color: var(--stamp); color: var(--stamp); }
                .fw-toggle{ transition: background 0.2s ease, transform 0.2s ease; }
                .fw-toggle:hover{ transform: scale(1.06); }
            `}</style>

            <div className="fw-bgtexture" />

            {/* HEADER */}
            <header style={{ position: "sticky", top: 0, zIndex: 50, background: mode === "dark" ? "rgba(10,12,15,0.85)" : "rgba(237,240,245,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
                <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", maxWidth: 1160, margin: "0 auto" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, fontWeight: 600, textDecoration: "none", color: "var(--ink)" }} className="fw-display">
                        <span style={{ width: 11, height: 11, background: "var(--stamp)", display: "inline-block", transform: "rotate(45deg)", borderRadius: 2 }} />
                        Fieldwork
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <Link href="/dashboard/forms" style={{ color: "var(--stamp)", textDecoration: "none", fontSize: 14.5, fontWeight: 600 }}>
                            My Forms
                        </Link>
                        <button
                            className="fw-toggle"
                            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                            style={{
                                width: 34, height: 34, borderRadius: 8, border: "1px solid var(--line)",
                                background: "var(--paper)", color: "var(--ink)", display: "flex",
                                alignItems: "center", justifyContent: "center", cursor: "pointer",
                            }}
                            aria-label="Toggle theme"
                        >
                            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        {user && (
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--stampSoft)", color: "var(--stamp)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, fontFamily: "'Fraunces', serif" }}>
                                        {(user.fullName ?? user.email ?? "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <Link href="/account" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2, textDecoration: "none" }}>{user.fullName || "Account"}</Link>
                                        <span className="fw-mono" style={{ fontSize: 10, color: "var(--inkSoft)" }}>{user.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSignout}
                                    disabled={signingOut}
                                    className="fw-btn-ghost"
                                    title="Sign out"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "8px 14px",
                                        border: "1px solid var(--line)",
                                        borderRadius: 7,
                                        background: "transparent",
                                        color: signingOut ? "var(--inkSoft)" : "var(--stamp)",
                                        cursor: signingOut ? "not-allowed" : "pointer",
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                >
                                    <LogOut size={14} />
                                    {signingOut ? "Signing out…" : "Sign out"}
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* MAIN CONTENT */}
            <main style={{ position: "relative", zIndex: 1, padding: "48px 32px", maxWidth: 1160, margin: "0 auto" }}>
                {/* HERO SECTION */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                        <div>
                            <div className="fw-mono" style={{ fontSize: 13, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <span style={{ width: 22, height: 1, background: "var(--stamp)", display: "inline-block" }} />
                                Dashboard
                            </div>
                            <h1 className="fw-display" style={{ fontWeight: 600, fontSize: "clamp(32px, 4vw, 42px)", letterSpacing: "-0.015em", margin: "0 0 12px", lineHeight: 1.1 }}>
                                Your Forms
                            </h1>
                            <p style={{ fontSize: 16, color: "var(--inkSoft)", margin: 0, maxWidth: 480 }}>
                                Create, manage, and track all your forms in one place.
                            </p>
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            className="fw-btn-primary"
                            style={{ 
                                background: "var(--stamp)", 
                                color: "#fff", 
                                padding: "13px 24px", 
                                borderRadius: 8, 
                                fontWeight: 600, 
                                fontSize: 15, 
                                border: "none", 
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8
                            }}
                        >
                            <Plus size={18} />
                            New Form
                        </button>
                    </div>

                    {/* STATS */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
                        {[
                            { icon: <TrendingUp size={18} />, label: "Total Forms", value: forms?.length || 0 },
                            { icon: <Users size={18} />, label: "Total Responses", value: forms?.reduce((sum: number, f) => sum + (f.responseCount || 0), 0) || 0 },
                            { icon: <Clock size={18} />, label: "Active Forms", value: forms?.filter(f => (f.responseCount || 0) > 0).length || 0 },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "var(--paper)",
                                    border: "1px solid var(--line)",
                                    borderRadius: 10,
                                    padding: "20px 18px",
                                    transform: `rotate(${[-0.5, 0.3, -0.4][i]}deg)`,
                                }}
                            >
                                <div style={{ color: "var(--stamp)", marginBottom: 12 }}>{stat.icon}</div>
                                <div className="fw-display" style={{ fontSize: 28, fontWeight: 600, marginBottom: 6 }}>
                                    {stat.value}
                                </div>
                                <div className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FORMS GRID */}
                {isLoading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "var(--paper)",
                                    border: "1px solid var(--line)",
                                    borderRadius: 10,
                                    padding: 24,
                                    height: 240,
                                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                }}
                            />
                        ))}
                    </div>
                ) : !forms || forms.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 20px" }}>
                        <div style={{ 
                            width: 80, 
                            height: 80, 
                            margin: "0 auto 24px", 
                            background: "var(--paper)", 
                            border: "2px dashed var(--line)", 
                            borderRadius: "50%", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center" 
                        }}>
                            <Plus size={32} color="var(--inkSoft)" />
                        </div>
                        <h3 className="fw-display" style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
                            No forms yet
                        </h3>
                        <p style={{ color: "var(--inkSoft)", marginBottom: 24, fontSize: 15 }}>
                            Create your first form to start collecting responses.
                        </p>
                        <button
                            onClick={() => setOpen(true)}
                            className="fw-btn-primary"
                            style={{ 
                                background: "var(--stamp)", 
                                color: "#fff", 
                                padding: "13px 24px", 
                                borderRadius: 8, 
                                fontWeight: 600, 
                                fontSize: 15, 
                                border: "none", 
                                cursor: "pointer" 
                            }}
                        >
                            Create Your First Form
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                        {forms.map((form, index) => {
                            const rot = [-0.7, 0.5, -0.3, 0.6, -0.5, 0.4, -0.4, 0.3][index % 8];
                            return (
                                <div
                                    key={form.id}
                                    className="fw-card"
                                    style={{
                                        background: "var(--paper)",
                                        border: "1px solid var(--line)",
                                        borderRadius: 10,
                                        padding: 24,
                                        transform: `rotate(${rot}deg)`,
                                        position: "relative",
                                    }}
                                >
                                    {/* Badge */}
                                    <div className="fw-mono" style={{ 
                                        position: "absolute", 
                                        top: 16, 
                                        right: 16, 
                                        fontSize: 10, 
                                        background: "var(--stampSoft)", 
                                        color: "var(--stamp)", 
                                        padding: "3px 8px", 
                                        borderRadius: 5,
                                        letterSpacing: "0.03em"
                                    }}>
                                        ACTIVE
                                    </div>

                                    {/* Title */}
                                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, marginTop: 8, lineHeight: 1.3 }}>
                                        {form.title}
                                    </h3>

                                    {/* Description */}
                                    <p style={{ fontSize: 14, color: "var(--inkSoft)", marginBottom: 20, lineHeight: 1.5, minHeight: 60 }}>
                                        {form.description || "No description provided"}
                                    </p>

                                    {/* Stats */}
                                    <div style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: "1fr 1fr", 
                                        gap: 12, 
                                        marginBottom: 20, 
                                        paddingTop: 16, 
                                        borderTop: "1px solid var(--line)" 
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>
                                                {form.responseCount || 0}
                                            </div>
                                            <div className="fw-mono" style={{ fontSize: 10, color: "var(--inkSoft)", textTransform: "uppercase" }}>
                                                Responses
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 20, fontWeight: 600, color: form.responseCount && form.responseCount > 0 ? "var(--ok)" : "var(--inkSoft)" }}>
                                                {form.responseCount && form.responseCount > 0 ? "Active" : "New"}
                                            </div>
                                            <div className="fw-mono" style={{ fontSize: 10, color: "var(--inkSoft)", textTransform: "uppercase" }}>
                                                Status
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <Link
                                            href={`/dashboard/forms/${form.id}`}
                                            className="fw-btn-ghost"
                                            style={{ flex: 1, border: "1px solid var(--line)", color: "var(--ink)", padding: "10px 16px", borderRadius: 7, fontWeight: 600, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                                        >
                                            <PencilLine size={14} />
                                            Edit
                                        </Link>
                                        <Link
                                            href={`/form/${form.id}/submissions`}
                                            className="fw-btn-ghost"
                                            style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "10px 14px", borderRadius: 7, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            title="View responses"
                                        >
                                            <Eye size={14} />
                                        </Link>
                                        <button
                                            onClick={() => handleCopyLink(form.id)}
                                            className="fw-btn-ghost"
                                            title="Copy form link"
                                            style={{ border: "1px solid var(--line)", color: copiedId === form.id ? "var(--ok)" : "var(--ink)", padding: "10px 14px", borderRadius: 7, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "color 0.2s" }}
                                        >
                                            {copiedId === form.id ? <Copy size={14} /> : <Link2 size={14} />}
                                        </button>
                                        <button
                                            onClick={() => handleDuplicate(form.id, form.title)}
                                            className="fw-btn-ghost"
                                            title="Duplicate form"
                                            style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "10px 14px", borderRadius: 7, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(form.id, form.title)}
                                            className="fw-btn-ghost"
                                            title="Delete form"
                                            style={{ border: "1px solid var(--line)", color: "var(--stamp)", padding: "10px 14px", borderRadius: 7, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Date */}
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 6, 
                                        marginTop: 16, 
                                        paddingTop: 16, 
                                        borderTop: "1px solid var(--line)" 
                                    }}>
                                        <Calendar size={12} color="var(--inkSoft)" />
                                        <span className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)" }}>
                                            {form.createdAt 
                                                ? new Date(form.createdAt).toLocaleDateString()
                                                : "Unknown"
                                            }
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <CreateFormDialog open={open} onOpenChange={setOpen} mode={mode} />
        </div>
    );
}
