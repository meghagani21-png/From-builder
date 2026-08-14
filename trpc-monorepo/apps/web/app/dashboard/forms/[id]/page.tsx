"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
    Plus, Trash2, GripVertical, Eye, ChevronDown, X, CheckSquare, 
    AlignLeft, Hash, Mail, ToggleLeft, List, ArrowLeft, Copy,
    Sun, Moon, ExternalLink, Loader2, Save, Share2, Check,
    ChevronUp, ChevronDown as ChevronDownIcon, Pencil
} from "lucide-react";

import { useCreateField, useUpdateField, useDeleteField, useGetFields } from "~/hooks/api/form-field";
import { useGetFormWithFields, useUpdateForm } from "~/hooks/api/form";
import { Input } from "~/components/ui/input";
import { THEMES, FW_CSS } from "~/lib/fieldwork";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD" | "MULTIPLE_CHOICE";

interface FieldOption {
    label: string;
    value: string;
}

interface Field {
    id: string;
    label: string;
    labelKey: string;
    type: FieldType;
    description: string | null;
    placeholder: string | null;
    isRequired: boolean;
    index: string;
    options: FieldOption[] | null;
}

const FIELD_TYPES: { value: FieldType; label: string; icon: React.ElementType }[] = [
    { value: "TEXT",            label: "Short answer",    icon: AlignLeft },
    { value: "NUMBER",          label: "Number",          icon: Hash },
    { value: "EMAIL",           label: "Email",           icon: Mail },
    { value: "YES_NO",          label: "Yes / No",        icon: ToggleLeft },
    { value: "MULTIPLE_CHOICE", label: "Multiple choice", icon: List },
    { value: "PASSWORD",        label: "Password",        icon: CheckSquare },
];

function typeLabel(t: FieldType) {
    return FIELD_TYPES.find((f) => f.value === t)?.label ?? t;
}

function OptionsEditor({
    options,
    onChange,
}: {
    options: FieldOption[];
    onChange: (opts: FieldOption[]) => void;
}) {
    const add = () => {
        const n = options.length + 1;
        onChange([...options, { label: `Option ${n}`, value: `option_${n}` }]);
    };

    const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));

    const update = (i: number, val: string) => {
        const next = options.map((o, idx) =>
            idx === i
                ? { label: val, value: val.toLowerCase().replace(/\s+/g, "_") }
                : o,
        );
        onChange(next);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {options.map((opt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--line)", flexShrink: 0 }} />
                    <Input
                        value={opt.label}
                        onChange={(e) => update(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        style={{ 
                            background: "var(--paperAlt)", 
                            border: "1px solid var(--line)", 
                            color: "var(--ink)", 
                            flex: 1 
                        }}
                    />
                    {options.length > 1 && (
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            style={{ 
                                padding: 6, 
                                background: "transparent", 
                                border: "none", 
                                cursor: "pointer", 
                                color: "var(--inkSoft)" 
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                style={{ 
                    border: "1px solid var(--line)", 
                    color: "var(--ink)", 
                    padding: "8px 16px", 
                    borderRadius: 6, 
                    fontWeight: 500, 
                    fontSize: 13, 
                    background: "transparent", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                }}
            >
                <Plus size={14} />
                Add option
            </button>
        </div>
    );
}

function FieldCard({
    field,
    onUpdate,
    onDelete,
    onDuplicate,
}: {
    field: Field;
    onUpdate: (id: string, updates: Partial<Field>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (field: Field) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(field.label);
    const [description, setDescription] = useState(field.description || "");
    const [type, setType] = useState<FieldType>(field.type);
    const [required, setRequired] = useState(field.isRequired);
    const [options, setOptions] = useState<FieldOption[]>(
        field.options || [
            { label: "Option 1", value: "option_1" },
            { label: "Option 2", value: "option_2" },
        ]
    );

    const handleSave = () => {
        onUpdate(field.id, {
            label,
            description: description || null,
            type,
            isRequired: required,
            options: type === "MULTIPLE_CHOICE" ? options : undefined,
        });
        setEditing(false);
    };

    return (
        <div
            style={{
                background: "var(--paper)",
                border: editing ? "2px solid var(--stamp)" : "1px solid var(--line)",
                borderRadius: 10,
                padding: 20,
                marginBottom: 16,
                transition: "all 0.2s ease",
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: editing ? 16 : 0 }}>
                <button
                    style={{
                        cursor: "grab",
                        padding: 4,
                        background: "transparent",
                        border: "none",
                        color: "var(--inkSoft)",
                    }}
                >
                    <GripVertical size={18} />
                </button>

                <div style={{ flex: 1 }}>
                    {editing ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <Input
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="Question"
                                style={{ 
                                    background: "var(--paperAlt)", 
                                    border: "1px solid var(--line)", 
                                    color: "var(--ink)",
                                    fontSize: 15,
                                    fontWeight: 500
                                }}
                            />
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                                style={{ 
                                    background: "var(--paperAlt)", 
                                    border: "1px solid var(--line)", 
                                    color: "var(--ink)",
                                    fontSize: 13
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: "var(--ink)" }}>
                                {field.label}
                                {field.isRequired && <span style={{ color: "var(--stamp)", marginLeft: 4 }}>*</span>}
                            </h4>
                            {field.description && (
                                <p style={{ fontSize: 13, color: "var(--inkSoft)", marginTop: 4 }}>
                                    {field.description}
                                </p>
                            )}
                            <div style={{ fontSize: 11, color: "var(--steel)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                {typeLabel(field.type)}
                            </div>
                        </div>
                    )}
                </div>

                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        style={{
                            padding: "6px 12px",
                            fontSize: 12,
                            border: "1px solid var(--line)",
                            borderRadius: 6,
                            background: "transparent",
                            color: "var(--ink)",
                            cursor: "pointer",
                            fontWeight: 500
                        }}
                    >
                        Edit
                    </button>
                )}
            </div>

            {editing && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                            Field Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as FieldType)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                background: "var(--paperAlt)",
                                border: "1px solid var(--line)",
                                borderRadius: 6,
                                color: "var(--ink)",
                                fontSize: 14,
                                cursor: "pointer"
                            }}
                        >
                            {FIELD_TYPES.map((ft) => (
                                <option key={ft.value} value={ft.value}>
                                    {ft.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {type === "MULTIPLE_CHOICE" && (
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                                Options
                            </label>
                            <OptionsEditor options={options} onChange={setOptions} />
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <input
                            type="checkbox"
                            checked={required}
                            onChange={(e) => setRequired(e.target.checked)}
                            style={{ width: 18, height: 18, cursor: "pointer" }}
                        />
                        <label style={{ fontSize: 14, color: "var(--ink)", cursor: "pointer" }}>
                            Required
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                            onClick={() => onDuplicate(field)}
                            style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                border: "1px solid var(--line)",
                                borderRadius: 6,
                                background: "transparent",
                                color: "var(--ink)",
                                cursor: "pointer",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                            }}
                        >
                            <Copy size={14} />
                            Duplicate
                        </button>
                        <button
                            onClick={() => onDelete(field.id)}
                            style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                border: "1px solid var(--line)",
                                borderRadius: 6,
                                background: "transparent",
                                color: "var(--stamp)",
                                cursor: "pointer",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                            }}
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setLabel(field.label);
                                setDescription(field.description || "");
                                setType(field.type);
                                setRequired(field.isRequired);
                            }}
                            style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                border: "1px solid var(--line)",
                                borderRadius: 6,
                                background: "transparent",
                                color: "var(--ink)",
                                cursor: "pointer",
                                fontWeight: 500
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: "8px 16px",
                                fontSize: 13,
                                border: "none",
                                borderRadius: 6,
                                background: "var(--stamp)",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                            }}
                        >
                            <Save size={14} />
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FormBuilder() {
    const params = useParams();
    const formId = params?.id as string;
    const [mode, setMode] = useState<"dark" | "light">("dark");
    const [preview, setPreview] = useState(false);
    const [showAddFieldModal, setShowAddFieldModal] = useState(false);
    const [pendingType, setPendingType] = useState<FieldType | null>(null);
    const [newLabel, setNewLabel] = useState("");
    const [newOptions, setNewOptions] = useState<{ label: string; value: string }[]>([
        { label: "Option 1", value: "option_1" },
        { label: "Option 2", value: "option_2" },
    ]);
    const [creating, setCreating] = useState(false);

    // Task 3: inline title/description editing
    const [editingTitle, setEditingTitle] = useState(false);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftDesc, setDraftDesc] = useState("");

    // Task 4: share link copied state
    const [linkCopied, setLinkCopied] = useState(false);

    const { form, isLoading: formLoading } = useGetFormWithFields(formId);
    const { fields, isLoading } = useGetFields(formId);
    const { createFieldAsync } = useCreateField();
    const { updateFieldAsync } = useUpdateField();
    const { deleteFieldAsync } = useDeleteField();
    const { updateFormAsync } = useUpdateForm();

    const t = THEMES[mode];

    // Task 4: copy share link
    const handleCopyLink = () => {
        const url = `${window.location.origin}/form/${formId}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).catch(() => fallbackCopy(url));
        } else {
            fallbackCopy(url);
        }
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const fallbackCopy = (text: string) => {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        try { document.execCommand("copy"); } catch (_) { /* silent */ }
        document.body.removeChild(el);
    };

    // Task 3: save edited title/description
    const handleSaveTitle = async () => {
        if (!draftTitle.trim()) return;
        await updateFormAsync({ formId, title: draftTitle.trim(), description: draftDesc.trim() || null });
        setEditingTitle(false);
    };

    // Task 6: reorder fields
    const handleMoveField = async (fieldId: string, direction: "up" | "down") => {
        if (!fields) return;
        const sorted = [...fields].sort((a, b) => parseFloat(a.index) - parseFloat(b.index));
        const idx = sorted.findIndex(f => f.id === fieldId);
        if (direction === "up" && idx === 0) return;
        if (direction === "down" && idx === sorted.length - 1) return;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        const currentIndex = sorted[idx]!.index;
        const swapIndex = sorted[swapIdx]!.index;
        await updateFieldAsync({ fieldId: sorted[idx]!.id, index: swapIndex } as any);
        await updateFieldAsync({ fieldId: sorted[swapIdx]!.id, index: currentIndex } as any);
    };

    // allowMultipleSubmissions toggle
    const [toggling, setToggling] = useState(false);

    const handleToggleMultiple = async () => {
        if (!form) return;
        setToggling(true);
        try {
            await updateFormAsync({
                formId,
                allowMultipleSubmissions: !form.allowMultipleSubmissions,
            });
        } finally {
            setToggling(false);
        }
    };

    const openModal = () => {
        setPendingType(null);
        setNewLabel("");
        setNewOptions([{ label: "Option 1", value: "option_1" }, { label: "Option 2", value: "option_2" }]);
        setShowAddFieldModal(true);
    };

    const selectType = (type: FieldType) => {
        setPendingType(type);
        setNewLabel("");
    };

    const handleCreateField = async () => {
        if (!pendingType || !newLabel.trim()) return;
        setCreating(true);
        // Close modal immediately for snappy UX — query will refetch in background
        const type = pendingType;
        const label = newLabel.trim();
        setShowAddFieldModal(false);
        setPendingType(null);
        setNewLabel("");
        setNewOptions([{ label: "Option 1", value: "option_1" }, { label: "Option 2", value: "option_2" }]);
        try {
            const fieldData: {
                formId: string;
                label: string;
                labelKey: string;
                type: FieldType;
                isRequired: boolean;
                options?: { label: string; value: string }[];
            } = {
                formId,
                label,
                labelKey: `field_${Date.now()}`,
                type,
                isRequired: false,
            };

            if (type === "MULTIPLE_CHOICE") {
                fieldData.options = newOptions.filter(o => o.label.trim() !== "");
            }

            await createFieldAsync(fieldData);
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateField = async (id: string, updates: Partial<Field>) => {
        await updateFieldAsync({
            fieldId: id,
            ...updates,
        });
    };

    const handleDeleteField = async (id: string) => {
        await deleteFieldAsync({ fieldId: id });
    };

    const handleDuplicate = async (field: Field) => {
        const fieldData: any = {
            formId,
            label: `${field.label} (copy)`,
            labelKey: `${field.labelKey}_copy_${Date.now()}`,
            type: field.type,
            isRequired: field.isRequired,
        };
        if (field.description) fieldData.description = field.description;
        if (field.placeholder) fieldData.placeholder = field.placeholder;
        if (field.options) fieldData.options = field.options;

        await createFieldAsync(fieldData);
    };

    return (
        <div style={{ "--bg": t.bg, "--paper": t.paper, "--paperAlt": t.paperAlt, "--ink": t.ink, "--inkSoft": t.inkSoft, "--steel": t.steel, "--stamp": t.stamp, "--stampSoft": t.stampSoft, "--line": t.line, "--ok": t.ok, "--gridLine": t.gridLine, background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", transition: "background 0.4s ease, color 0.4s ease", position: "relative", overflowX: "hidden" } as React.CSSProperties}>
            <style>{FW_CSS}</style>
            <div className="fw-bgtexture" />
            <div className="fw-glow" style={{ top: "-140px", right: "-100px" }} />

            <header style={{ position: "sticky", top: 0, zIndex: 50, background: mode === "dark" ? "rgba(10,12,15,0.75)" : "rgba(237,240,245,0.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}>
                <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <Link href="/dashboard/forms" className="fw-btn-ghost" style={{ padding: "8px 14px", border: "1px solid var(--line)", borderRadius: 7, textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
                            <ArrowLeft size={14} />
                            Back
                        </Link>
                        <div>
                            <div className="fw-display" style={{ fontSize: 18, fontWeight: 600 }}>{form?.title || "Form Builder"}</div>
                            <div className="fw-mono" style={{ fontSize: 10, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", gap: 10 }}>
                                <span>{fields?.length ?? 0} field{(fields?.length ?? 0) !== 1 ? "s" : ""}</span>
                                <span>·</span>
                                <span>{preview ? "preview mode" : "editing"}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button onClick={() => setPreview(!preview)} className="fw-btn-ghost" style={{ padding: "8px 16px", border: "1px solid var(--line)", borderRadius: 7, background: preview ? "var(--stampSoft)" : "transparent", color: preview ? "var(--stamp)" : "var(--ink)", cursor: "pointer", fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <Eye size={14} />
                            {preview ? "Edit" : "Preview"}
                        </button>
                        <button onClick={handleCopyLink} className="fw-btn-ghost" title="Copy share link" style={{ padding: "8px 16px", border: "1px solid var(--line)", borderRadius: 7, background: "transparent", color: linkCopied ? "var(--ok)" : "var(--ink)", cursor: "pointer", fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            {linkCopied ? <Check size={14} /> : <Share2 size={14} />}
                            {linkCopied ? "Copied!" : "Share"}
                        </button>
                        <Link href={`/form/${formId}`} target="_blank" className="fw-btn-ghost" style={{ padding: "8px 16px", border: "1px solid var(--line)", borderRadius: 7, background: "transparent", color: "var(--ink)", textDecoration: "none", fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <ExternalLink size={14} />
                            Open
                        </Link>
                        <button className="fw-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Toggle theme">
                            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                </nav>
            </header>

            <main style={{ position: "relative", zIndex: 1, padding: "40px 32px", maxWidth: 800, margin: "0 auto" }}>
                {isLoading || formLoading ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: 15, color: "var(--inkSoft)" }}>Loading...</div>
                    </div>
                ) : (
                    <>
                        <div style={{
                            background: "var(--paper)",
                            border: "2px solid var(--stamp)",
                            borderRadius: 10,
                            padding: 28,
                            marginBottom: 24,
                        }}>
                            {editingTitle ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <Input
                                        value={draftTitle}
                                        onChange={(e) => setDraftTitle(e.target.value)}
                                        placeholder="Form title"
                                        autoFocus
                                        style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", fontSize: 18, fontWeight: 600 }}
                                    />
                                    <Input
                                        value={draftDesc}
                                        onChange={(e) => setDraftDesc(e.target.value)}
                                        placeholder="Form description (optional)"
                                        style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", fontSize: 14 }}
                                    />
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={handleSaveTitle} className="fw-btn-primary" style={{ padding: "8px 18px", background: "var(--stamp)", color: "#fff", border: "none", borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                                            <Save size={13} /> Save
                                        </button>
                                        <button onClick={() => setEditingTitle(false)} style={{ padding: "8px 16px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 7, fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h1 className="fw-display" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
                                            {form?.title || "Untitled Form"}
                                        </h1>
                                        <p style={{ fontSize: 14, color: "var(--inkSoft)", margin: "0 0 12px" }}>
                                            {form?.description || "No description — click Edit to add one"}
                                        </p>
                                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                            <div className="fw-mono" style={{ fontSize: 11, background: "var(--stampSoft)", color: "var(--stamp)", padding: "3px 10px", borderRadius: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                                {fields?.length ?? 0} field{(fields?.length ?? 0) !== 1 ? "s" : ""}
                                            </div>
                                            <Link href={`/form/${formId}/submissions`} style={{ fontSize: 11, background: "var(--paperAlt)", color: "var(--inkSoft)", padding: "3px 10px", borderRadius: 5, textDecoration: "none", border: "1px solid var(--line)" }} className="fw-mono">
                                                View responses →
                                            </Link>
                                        </div>
                                        {/* Multiple submissions toggle */}
                                        <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>
                                                    Allow multiple responses
                                                </div>
                                                <div className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)" }}>
                                                    {form?.allowMultipleSubmissions
                                                        ? "Respondents can submit more than once"
                                                        : "Each respondent can only submit once"}
                                                </div>
                                            </div>
                                            {/* Toggle switch */}
                                            <button
                                                onClick={handleToggleMultiple}
                                                disabled={toggling}
                                                title={form?.allowMultipleSubmissions ? "Click to allow only one submission" : "Click to allow multiple submissions"}
                                                style={{
                                                    position: "relative",
                                                    width: 48,
                                                    height: 26,
                                                    borderRadius: 13,
                                                    border: "none",
                                                    background: form?.allowMultipleSubmissions ? "var(--ok)" : "var(--line)",
                                                    cursor: toggling ? "not-allowed" : "pointer",
                                                    transition: "background 0.25s ease",
                                                    flexShrink: 0,
                                                    opacity: toggling ? 0.6 : 1,
                                                }}
                                                aria-checked={form?.allowMultipleSubmissions}
                                                role="switch"
                                            >
                                                <span style={{
                                                    position: "absolute",
                                                    top: 3,
                                                    left: form?.allowMultipleSubmissions ? 25 : 3,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: "50%",
                                                    background: "#fff",
                                                    transition: "left 0.25s ease",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                                                }} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setDraftTitle(form?.title || ""); setDraftDesc(form?.description || ""); setEditingTitle(true); }}
                                        title="Edit title"
                                        style={{ padding: "8px 12px", background: "transparent", border: "1px solid var(--line)", borderRadius: 7, color: "var(--inkSoft)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12, flexShrink: 0 }}
                                    >
                                        <Pencil size={13} /> Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        {fields && fields.length > 0 ? (
                            preview ? (
                                // Task 7: Preview mode — show fields as they appear to respondents
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div style={{ padding: "12px 16px", background: "var(--stampSoft)", border: "1px solid var(--stamp)", borderRadius: 8, fontSize: 13, color: "var(--stamp)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                        <Eye size={14} /> Preview mode — this is how your form looks to respondents
                                    </div>
                                    {[...fields].sort((a, b) => parseFloat(a.index) - parseFloat(b.index)).map((field: any) => (
                                        <div key={field.id} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "20px 24px" }}>
                                            <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>
                                                {field.label}
                                                {field.isRequired && <span style={{ color: "var(--stamp)", marginLeft: 4 }}>*</span>}
                                            </label>
                                            {field.description && <p style={{ fontSize: 13, color: "var(--inkSoft)", marginBottom: 10 }}>{field.description}</p>}
                                            {(field.type === "TEXT") && <div style={{ border: "1px solid var(--line)", borderRadius: 7, padding: "10px 14px", background: "var(--paperAlt)", color: "var(--inkSoft)", fontSize: 14 }}>Your answer</div>}
                                            {field.type === "NUMBER" && <div style={{ border: "1px solid var(--line)", borderRadius: 7, padding: "10px 14px", background: "var(--paperAlt)", color: "var(--inkSoft)", fontSize: 14 }}>0</div>}
                                            {field.type === "EMAIL" && <div style={{ border: "1px solid var(--line)", borderRadius: 7, padding: "10px 14px", background: "var(--paperAlt)", color: "var(--inkSoft)", fontSize: 14 }}>your@email.com</div>}
                                            {field.type === "PASSWORD" && <div style={{ border: "1px solid var(--line)", borderRadius: 7, padding: "10px 14px", background: "var(--paperAlt)", color: "var(--inkSoft)", fontSize: 14 }}>••••••••</div>}
                                            {field.type === "YES_NO" && (
                                                <div style={{ display: "flex", gap: 10 }}>
                                                    {["Yes", "No"].map(opt => (
                                                        <div key={opt} style={{ flex: 1, textAlign: "center", padding: "10px", border: "1px solid var(--line)", borderRadius: 7, background: "var(--paperAlt)", color: "var(--inkSoft)", fontSize: 14 }}>{opt}</div>
                                                    ))}
                                                </div>
                                            )}
                                            {field.type === "MULTIPLE_CHOICE" && field.options && (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                    {field.options.map((opt: any) => (
                                                        <div key={opt.value} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 7, background: "var(--paperAlt)", color: "var(--inkSoft)", fontSize: 14 }}>
                                                            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--line)" }} />
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button disabled style={{ padding: "13px 32px", background: "var(--stamp)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, opacity: 0.7, cursor: "not-allowed", alignSelf: "flex-start" }}>
                                        Submit (preview)
                                    </button>
                                </div>
                            ) : (
                                // Edit mode with reorder buttons (Task 6)
                                [...fields].sort((a, b) => parseFloat(a.index) - parseFloat(b.index)).map((field, idx) => (
                                    <div key={field.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                        {/* Up/Down reorder buttons */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 18 }}>
                                            <button
                                                onClick={() => handleMoveField(field.id, "up")}
                                                disabled={idx === 0}
                                                style={{ width: 28, height: 28, border: "1px solid var(--line)", borderRadius: 6, background: "var(--paper)", color: idx === 0 ? "var(--line)" : "var(--inkSoft)", cursor: idx === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                title="Move up"
                                            >
                                                <ChevronUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleMoveField(field.id, "down")}
                                                disabled={idx === fields.length - 1}
                                                style={{ width: 28, height: 28, border: "1px solid var(--line)", borderRadius: 6, background: "var(--paper)", color: idx === fields.length - 1 ? "var(--line)" : "var(--inkSoft)", cursor: idx === fields.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                title="Move down"
                                            >
                                                <ChevronDownIcon size={14} />
                                            </button>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <FieldCard
                                                key={field.id}
                                                field={field}
                                                onUpdate={handleUpdateField}
                                                onDelete={handleDeleteField}
                                                onDuplicate={handleDuplicate}
                                            />
                                        </div>
                                    </div>
                                ))
                            )
                        ) : (
                            <div style={{ textAlign: "center", padding: "60px 20px" }}>
                                <div style={{ 
                                    width: 80, 
                                    height: 80, 
                                    margin: "0 auto 20px", 
                                    background: "var(--paper)", 
                                    border: "2px dashed var(--line)", 
                                    borderRadius: "50%", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center" 
                                }}>
                                    <Plus size={32} color="var(--inkSoft)" />
                                </div>
                                <h3 className="fw-display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>
                                    No fields yet
                                </h3>
                                <p style={{ color: "var(--inkSoft)", marginBottom: 24, fontSize: 14 }}>
                                    Start building your form by adding fields
                                </p>
                                <button onClick={openModal} className="fw-btn-primary" style={{ padding: "12px 24px", background: "var(--stamp)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                                    <Plus size={16} /> Add your first field
                                </button>
                            </div>
                        )}

                        <button
                            onClick={openModal}
                            className="fw-btn-primary"
                            style={{
                                width: "100%",
                                padding: "14px 20px",
                                background: "var(--stamp)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                marginTop: 20
                            }}
                        >
                            <Plus size={18} />
                            Add Field
                        </button>

                        {showAddFieldModal && (
                            <div
                                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}
                                onClick={() => setShowAddFieldModal(false)}
                            >
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, width: "100%", maxWidth: 540, padding: 28, boxShadow: "0 20px 60px -10px rgba(0,0,0,0.5)", maxHeight: "85vh", overflow: "auto" }}
                                >
                                    {/* Modal header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                        <div>
                                            <h2 className="fw-display" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                                                {pendingType ? "Configure field" : "Choose field type"}
                                            </h2>
                                            {pendingType && (
                                                <button onClick={() => setPendingType(null)} style={{ fontSize: 12, color: "var(--stamp)", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
                                                    ← Change type
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={() => setShowAddFieldModal(false)} style={{ width: 32, height: 32, borderRadius: 6, background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--inkSoft)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Step 1 — pick type */}
                                    {!pendingType && (
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                                            {FIELD_TYPES.map((ft) => {
                                                const Icon = ft.icon;
                                                return (
                                                    <button
                                                        key={ft.value}
                                                        onClick={() => selectType(ft.value as FieldType)}
                                                        style={{ padding: 16, borderRadius: 8, background: "var(--paperAlt)", border: "2px solid var(--line)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all 0.15s ease", textAlign: "center" }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--stamp)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = "translateY(0)"; }}
                                                    >
                                                        <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--stampSoft)", color: "var(--stamp)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <Icon size={18} />
                                                        </div>
                                                        <span style={{ fontWeight: 600, fontSize: 12, color: "var(--ink)" }}>{ft.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Step 2 — configure */}
                                    {pendingType && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                            {/* selected type badge */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--stampSoft)", border: "1px solid var(--stamp)", borderRadius: 8 }}>
                                                {(() => { const ft = FIELD_TYPES.find(f => f.value === pendingType)!; const Icon = ft.icon; return (<><Icon size={16} color="var(--stamp)" /><span className="fw-mono" style={{ fontSize: 12, color: "var(--stamp)", fontWeight: 600 }}>{ft.label}</span></>); })()}
                                            </div>

                                            {/* label */}
                                            <div>
                                                <label className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                                                    Question label <span style={{ color: "var(--stamp)" }}>*</span>
                                                </label>
                                                <Input
                                                    autoFocus
                                                    value={newLabel}
                                                    onChange={(e) => setNewLabel(e.target.value)}
                                                    placeholder={`e.g., What is your ${pendingType === "EMAIL" ? "email address" : pendingType === "NUMBER" ? "age" : "full name"}?`}
                                                    onKeyDown={(e) => { if (e.key === "Enter" && pendingType !== "MULTIPLE_CHOICE") handleCreateField(); }}
                                                    style={{ background: "var(--paperAlt)", border: "1px solid var(--line)", color: "var(--ink)", fontSize: 15, padding: "12px 14px" }}
                                                />
                                            </div>

                                            {/* options for multiple choice */}
                                            {pendingType === "MULTIPLE_CHOICE" && (
                                                <div>
                                                    <label className="fw-mono" style={{ fontSize: 11, color: "var(--inkSoft)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>
                                                        Options
                                                    </label>
                                                    <OptionsEditor options={newOptions} onChange={setNewOptions} />
                                                </div>
                                            )}

                                            {/* actions */}
                                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--line)" }}>
                                                <button
                                                    onClick={() => setShowAddFieldModal(false)}
                                                    style={{ padding: "10px 18px", border: "1px solid var(--line)", borderRadius: 7, background: "transparent", color: "var(--ink)", cursor: "pointer", fontWeight: 500, fontSize: 14 }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleCreateField}
                                                    disabled={!newLabel.trim() || creating}
                                                    className="fw-btn-primary"
                                                    style={{ padding: "10px 22px", border: "none", borderRadius: 7, background: !newLabel.trim() || creating ? "var(--inkSoft)" : "var(--stamp)", color: "#fff", cursor: !newLabel.trim() || creating ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
                                                >
                                                    <Plus size={14} />
                                                    {creating ? "Adding…" : "Add field"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
