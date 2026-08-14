"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useGetFormWithFields } from "~/hooks/api/form";
import { useCreateSubmission } from "~/hooks/api/form-submission";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD" | "MULTIPLE_CHOICE";
interface FieldOption { label: string; value: string; }
interface Field {
    id: string; label: string; type: FieldType;
    description?: string | null; placeholder?: string | null;
    isRequired?: boolean; options?: FieldOption[] | null; index?: string;
}

function FieldRenderer({ field, value, onChange, showError }: { field: Field; value: string; onChange: (v: string) => void; showError: boolean; }) {
    const inputStyle = { background: "var(--paperAlt)", border: `1px solid ${showError ? "var(--stamp)" : "var(--line)"}`, color: "var(--ink)", fontSize: 15, padding: "11px 14px", borderRadius: 7, width: "100%", outline: "none", fontFamily: "'Inter', sans-serif" };

    return (
        <div style={{ marginBottom: 0 }}>
            <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                {field.label}
                {field.isRequired && <span style={{ color: "var(--stamp)", marginLeft: 4 }}>*</span>}
            </label>
            {field.description && <p style={{ fontSize: 13, color: "var(--inkSoft)", marginBottom: 10 }}>{field.description}</p>}

            {field.type === "TEXT" && (
                <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? "Your answer"} rows={3} style={{ ...inputStyle, resize: "none" }} />
            )}
            {field.type === "NUMBER" && (
                <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? "0"} style={inputStyle} />
            )}
            {field.type === "EMAIL" && (
                <Input type="email" value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? "your@email.com"} style={inputStyle} />
            )}
            {field.type === "PASSWORD" && (
                <Input type="password" value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? "••••••••"} style={inputStyle} />
            )}
            {field.type === "YES_NO" && (
                <div style={{ display: "flex", gap: 10 }}>
                    {["yes", "no"].map((opt) => (
                        <label key={opt} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 0", borderRadius: 7, border: value === opt ? "2px solid var(--stamp)" : "1px solid var(--line)", background: value === opt ? "var(--stampSoft)" : "var(--paperAlt)", color: value === opt ? "var(--stamp)" : "var(--ink)", cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.15s ease" }}>
                            <input type="radio" style={{ display: "none" }} value={opt} checked={value === opt} onChange={(e) => onChange(e.target.value)} />
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </label>
                    ))}
                </div>
            )}
            {field.type === "MULTIPLE_CHOICE" && field.options && field.options.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {field.options.map((opt) => (
                        <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 7, border: value === opt.value ? "2px solid var(--stamp)" : "1px solid var(--line)", background: value === opt.value ? "var(--stampSoft)" : "var(--paperAlt)", color: value === opt.value ? "var(--stamp)" : "var(--ink)", cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.15s ease" }}>
                            <span style={{ width: 16, height: 16, borderRadius: "50%", border: value === opt.value ? "5px solid var(--stamp)" : "2px solid var(--line)", flexShrink: 0, background: "transparent", transition: "all 0.15s ease" }} />
                            <input type="radio" style={{ display: "none" }} value={opt.value} checked={value === opt.value} onChange={(e) => onChange(e.target.value)} />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )}
            {showError && (
                <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--stamp)", marginTop: 6 }}>
                    <AlertCircle size={13} /> This question is required.
                </p>
            )}
        </div>
    );
}

export default function PublicFormPage() {
    const params = useParams();
    const formId = params?.id as string;
    const [mode] = useState<"dark" | "light">("dark");
    const t = THEMES[mode];

    const { form, isLoading } = useGetFormWithFields(formId);
    const { createSubmissionAsync, status, error } = useCreateSubmission();
    const [values, setValues] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    // Check localStorage to see if this browser already submitted a single-response form
    useEffect(() => {
        if (!form) return;
        if (form.allowMultipleSubmissions === false) {
            const key = `fw_submitted_${formId}`;
            if (typeof window !== "undefined" && localStorage.getItem(key)) {
                setAlreadySubmitted(true);
            }
        }
    }, [form, formId]);

    useEffect(() => {
        if (!form?.fields) return;
        const initial: Record<string, string> = {};
        for (const f of form.fields) initial[f.id] = "";
        setValues(initial);
    }, [form?.fields]);

    const handleChange = (fieldId: string, v: string) => {
        setValues((s) => ({ ...s, [fieldId]: v }));
        setTouched((s) => ({ ...s, [fieldId]: true }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitAttempted(true);
        const requiredFields = (form?.fields ?? []).filter((f: Field) => f.isRequired);
        const hasEmpty = requiredFields.some((f: Field) => !values[f.id]?.trim());
        if (hasEmpty) return;
        await createSubmissionAsync({ formId, values: Object.entries(values).map(([fieldId, value]) => ({ fieldId, value })) });
        // Mark as submitted in localStorage if single-response mode
        if (form?.allowMultipleSubmissions === false) {
            localStorage.setItem(`fw_submitted_${formId}`, "1");
        }
        setSubmitted(true);
    };

    const rootStyle = { "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: "relative" } as React.CSSProperties;

    if (isLoading) {
        return (
            <div style={rootStyle}>
                <style>{FW_CSS}</style>
                <div className="fw-bgtexture" />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                    <span className="fw-mono" style={{ fontSize: 13, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Loading form…</span>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div style={rootStyle}>
                <style>{FW_CSS}</style>
                <div className="fw-bgtexture" />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                    <span style={{ fontSize: 15, color: "var(--inkSoft)" }}>Form not found.</span>
                </div>
            </div>
        );
    }

    const fields = ((form.fields ?? []) as Field[]).slice().sort((a: any, b: any) => parseFloat(a.index ?? "0") - parseFloat(b.index ?? "0"));

    /* ── already submitted (single-response mode) ───────────────────────── */
    if (alreadySubmitted) {
        return (
            <div style={rootStyle}>
                <style>{FW_CSS}</style>
                <div className="fw-bgtexture" />
                <div className="fw-glow" style={{ top: "-140px", right: "-100px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
                    <div style={{ width: "100%", maxWidth: 480, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "48px 40px", textAlign: "center", boxShadow: "0 20px 44px -20px rgba(0,0,0,0.4)" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--stampSoft)", border: "2px solid var(--stamp)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                            <span style={{ fontSize: 28 }}>🔒</span>
                        </div>
                        <h2 className="fw-display" style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
                            You've already responded
                        </h2>
                        <p style={{ fontSize: 15, color: "var(--inkSoft)", lineHeight: 1.6, marginBottom: 8 }}>
                            <strong style={{ color: "var(--ink)" }}>{form.title}</strong>
                        </p>
                        <p style={{ fontSize: 14, color: "var(--inkSoft)", lineHeight: 1.6, marginBottom: 28 }}>
                            This form only accepts one response per person. Your previous response has already been recorded.
                        </p>
                        <div className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Only one response allowed
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── thank-you screen ───────────────────────────────────────────────── */
    if (submitted) {
        return (
            <div style={rootStyle}>
                <style>{FW_CSS}</style>
                <div className="fw-bgtexture" />
                <div className="fw-glow" style={{ top: "-140px", right: "-100px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
                    <div style={{ width: "100%", maxWidth: 480, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "48px 40px", textAlign: "center", boxShadow: "0 20px 44px -20px rgba(0,0,0,0.4)" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(63,221,151,0.15)", border: "2px solid var(--ok)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                            <CheckCircle2 size={32} color="var(--ok)" />
                        </div>
                        <h2 className="fw-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 10 }}>Response submitted</h2>
                        <p style={{ fontSize: 15, color: "var(--inkSoft)", marginBottom: 28, lineHeight: 1.6 }}>
                            Thanks for filling out this form. Your response has been recorded.
                        </p>
                        {form?.allowMultipleSubmissions !== false && (
                            <button
                                onClick={() => { setSubmitted(false); setSubmitAttempted(false); setTouched({}); if (form?.fields) { const r: Record<string, string> = {}; for (const f of form.fields) r[f.id] = ""; setValues(r); } }}
                                className="fw-btn-ghost"
                                style={{ padding: "11px 24px", border: "1px solid var(--line)", borderRadius: 8, background: "transparent", color: "var(--ink)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                            >
                                Submit another response
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ── form ───────────────────────────────────────────────────────────── */
    return (
        <div style={rootStyle}>
            <style>{FW_CSS}</style>
            <div className="fw-bgtexture" />
            <div className="fw-glow" style={{ top: "-140px", right: "-100px" }} />

            <main style={{ position: "relative", zIndex: 1, padding: "48px 20px 80px", maxWidth: 680, margin: "0 auto" }}>
                {/* form header card — stamp-coloured top border like landing hero card */}
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderTop: "3px solid var(--stamp)", borderRadius: 10, padding: "28px 32px", marginBottom: 16, boxShadow: "0 8px 24px -12px rgba(0,0,0,0.3)" }}>
                    <div className="fw-mono" style={{ fontSize: 11, color: "var(--stamp)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{fields.length} field{fields.length !== 1 ? "s" : ""}</div>
                    <h1 className="fw-display" style={{ fontSize: 28, fontWeight: 600, marginBottom: 6, lineHeight: 1.1 }}>{form.title}</h1>
                    {form.description && <p style={{ fontSize: 15, color: "var(--inkSoft)", lineHeight: 1.6 }}>{form.description}</p>}
                    <p style={{ marginTop: 14, fontSize: 12, color: "var(--inkSoft)" }}>
                        <span style={{ color: "var(--stamp)" }}>*</span> Required
                    </p>
                </div>

                {/* question cards */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {fields.map((f: Field) => {
                        const showError = !!(f.isRequired && (submitAttempted || touched[f.id]) && !values[f.id]?.trim());
                        return (
                            <div key={f.id} style={{ background: "var(--paper)", border: `1px solid ${showError ? "var(--stamp)" : "var(--line)"}`, borderRadius: 10, padding: "22px 28px", boxShadow: "0 4px 14px -8px rgba(0,0,0,0.2)", transition: "border-color 0.2s ease" }}>
                                <FieldRenderer field={f} value={values[f.id] ?? ""} onChange={(v) => handleChange(f.id, v)} showError={showError} />
                            </div>
                        );
                    })}

                    {/* submit row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
                        <button type="submit" disabled={status === "pending"} className="fw-btn-primary" style={{ padding: "13px 32px", background: status === "pending" ? "var(--inkSoft)" : "var(--stamp)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: status === "pending" ? "not-allowed" : "pointer" }}>
                            {status === "pending" ? "Submitting…" : "Submit"}
                        </button>
                        {error && (
                            <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--stamp)" }}>
                                <AlertCircle size={15} />{error.message}
                            </p>
                        )}
                    </div>
                </form>

                {/* footer note */}
                <p className="fw-mono" style={{ textAlign: "center", fontSize: 11, color: "var(--inkSoft)", marginTop: 28, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Never submit passwords through this form.
                </p>
            </main>
        </div>
    );
}
