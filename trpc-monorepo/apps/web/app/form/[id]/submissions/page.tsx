"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Sun, Moon } from "lucide-react";
import { useState } from "react";

import { useGetSubmissionsByFormId } from "~/hooks/api/form-submission";
import { useGetFields } from "~/hooks/api/form-field";
import { useGetFormWithFields } from "~/hooks/api/form";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

// ─── types ────────────────────────────────────────────────────────────────────

type Submission = {
    id: string;
    formId?: string | null;
    values?: { fieldId: string; value: string }[] | null;
    createdAt?: string | null;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function exportCSV(fields: { id: string; label: string }[], rows: Submission[]) {
    const headers = ["Submitted at", ...fields.map((f) => f.label)];
    const lines = rows.map((r) => {
        const date = r.createdAt ? new Date(r.createdAt).toLocaleString() : "";
        const cells = fields.map((f) => {
            const v = r.values?.find((x) => x.fieldId === f.id)?.value ?? "";
            // escape quotes
            return `"${v.replace(/"/g, '""')}"`;
        });
        return [`"${date}"`, ...cells].join(",");
    });
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormSubmissions() {
    const params = useParams();
    const formId = params?.id as string;
    const [mode, setMode] = useState<"dark" | "light">("dark");

    const { submissions, isLoading: subsLoading, error } = useGetSubmissionsByFormId(formId);
    const { fields, isLoading: fieldsLoading } = useGetFields(formId);
    const { form } = useGetFormWithFields(formId);

    const t = THEMES[mode];

    const orderedFields = useMemo(
        () =>
            [...(fields ?? [])].sort(
                (a, b) => parseFloat(a.index) - parseFloat(b.index),
            ),
        [fields],
    );

    const rows = useMemo(() => (submissions ?? []) as Submission[], [submissions]);
    const loading = subsLoading || fieldsLoading;

    return (
        <div style={{ "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", transition: "background 0.4s ease, color 0.4s ease" } as React.CSSProperties}>
            <style>{FW_CSS}</style>
            <div className="fw-bgtexture" />

            {/* HEADER */}
            <header style={{ position: "sticky", top: 0, zIndex: 50, background: mode === "dark" ? "rgba(10,12,15,0.9)" : "rgba(237,240,245,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
                <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <Link href="/dashboard/forms" className="fw-btn-ghost" style={{ padding: "8px 12px", border: "1px solid var(--line)", borderRadius: 6, textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
                            <ArrowLeft size={16} />
                            Back
                        </Link>
                        <div>
                            <div className="fw-display" style={{ fontSize: 18, fontWeight: 600 }}>{form?.title || "Form"}</div>
                            <div className="fw-mono" style={{ fontSize: 10, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                {rows.length} {rows.length === 1 ? "response" : "responses"}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {rows.length > 0 && orderedFields.length > 0 && (
                            <button
                                onClick={() => exportCSV(orderedFields, rows)}
                                className="fw-btn-ghost"
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid var(--line)",
                                    borderRadius: 6,
                                    background: "transparent",
                                    color: "var(--ink)",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    fontSize: 13,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                }}
                            >
                                <Download size={14} />
                                Export CSV
                            </button>
                        )}
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
                    </div>
                </nav>
            </header>

            {/* MAIN */}
            <main style={{ position: "relative", zIndex: 1, padding: "40px 32px", maxWidth: 1200, margin: "0 auto" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: 15, color: "var(--inkSoft)" }}>Loading submissions...</div>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: 15, color: "var(--stamp)" }}>Error loading submissions.</div>
                    </div>
                ) : rows.length === 0 ? (
                    <div style={{ 
                        background: "var(--paper)", 
                        border: "2px dashed var(--line)", 
                        borderRadius: 10, 
                        padding: "60px 20px", 
                        textAlign: "center" 
                    }}>
                        <div style={{ 
                            width: 80, 
                            height: 80, 
                            margin: "0 auto 20px", 
                            background: "var(--paperAlt)", 
                            border: "2px dashed var(--line)", 
                            borderRadius: "50%", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center" 
                        }}>
                            <Download size={32} color="var(--inkSoft)" />
                        </div>
                        <h3 className="fw-display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>
                            No responses yet
                        </h3>
                        <p style={{ color: "var(--inkSoft)", marginBottom: 24, fontSize: 14 }}>
                            Share the form link to start collecting submissions
                        </p>
                        <Link
                            href={`/form/${formId}`}
                            target="_blank"
                            className="fw-btn-primary"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "12px 20px",
                                background: "var(--stamp)",
                                color: "#fff",
                                borderRadius: 8,
                                textDecoration: "none",
                                fontWeight: 600,
                                fontSize: 14,
                            }}
                        >
                            Open Form →
                        </Link>
                    </div>
                ) : (
                    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", fontSize: 14 }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--paperAlt)" }}>
                                        <th className="fw-mono" style={{ 
                                            padding: "14px 20px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            fontWeight: 500, 
                                            color: "var(--inkSoft)", 
                                            textTransform: "uppercase", 
                                            letterSpacing: "0.05em" 
                                        }}>
                                            #
                                        </th>
                                        <th className="fw-mono" style={{ 
                                            padding: "14px 20px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            fontWeight: 500, 
                                            color: "var(--inkSoft)", 
                                            textTransform: "uppercase", 
                                            letterSpacing: "0.05em" 
                                        }}>
                                            Submitted
                                        </th>
                                        {orderedFields.map((f) => (
                                            <th
                                                key={f.id}
                                                style={{ 
                                                    padding: "14px 20px", 
                                                    textAlign: "left", 
                                                    fontSize: 13, 
                                                    fontWeight: 600, 
                                                    color: "var(--ink)",
                                                    whiteSpace: "nowrap"
                                                }}
                                            >
                                                {f.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r, idx) => (
                                        <tr
                                            key={r.id}
                                            style={{ 
                                                borderBottom: idx < rows.length - 1 ? "1px solid var(--line)" : "none",
                                                transition: "background 0.15s ease"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = t.paperAlt}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                        >
                                            <td className="fw-mono" style={{ padding: "14px 20px", fontSize: 11, color: "var(--inkSoft)" }}>
                                                {idx + 1}
                                            </td>
                                            <td className="fw-mono" style={{ padding: "14px 20px", fontSize: 11, color: "var(--inkSoft)", whiteSpace: "nowrap" }}>
                                                {r.createdAt
                                                    ? new Date(r.createdAt).toLocaleString()
                                                    : "—"}
                                            </td>
                                            {orderedFields.map((f) => {
                                                const cell = r.values?.find(
                                                    (x) => x.fieldId === f.id,
                                                );
                                                return (
                                                    <td
                                                        key={f.id}
                                                        style={{ 
                                                            padding: "14px 20px", 
                                                            fontSize: 14, 
                                                            color: "var(--ink)",
                                                            maxWidth: 300,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                        title={cell?.value ?? ""}
                                                    >
                                                        {cell?.value || (
                                                            <span style={{ color: "var(--inkSoft)" }}>—</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
