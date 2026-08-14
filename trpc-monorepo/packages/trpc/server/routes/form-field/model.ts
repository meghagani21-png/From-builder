import { z } from "zod";

export const fieldTypeEnum = z.enum([
    "TEXT",
    "NUMBER",
    "EMAIL",
    "YES_NO",
    "PASSWORD",
    "MULTIPLE_CHOICE",
]);

export const fieldOptionModel = z.object({
    label: z.string(),
    value: z.string(),
});

// ── createField ──────────────────────────────────────────────────────────────

export const createFieldInputModel = z.object({
    label: z.string().max(100).describe("Display label for the field"),
    type: fieldTypeEnum.describe("Type of the field"),
    formId: z.uuid().describe("UUID of the form this field belongs to"),
    description: z.string().max(1000).optional().describe("Helper text shown below the field"),
    placeholder: z.string().optional().describe("Placeholder text for the field"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
    options: z.array(fieldOptionModel).optional().describe("Options for MULTIPLE_CHOICE fields"),
});

export const createFieldOutputModel = z.object({
    id: z.string().describe("ID of the created field"),
    labelKey: z.string().describe("Immutable slug key for the field label"),
    index: z.string().describe("Index string for ordering"),
});

// ── updateField ──────────────────────────────────────────────────────────────

export const updateFieldInputModel = z.object({
    fieldId: z.uuid().describe("UUID of the field to update"),
    label: z.string().max(100).optional(),
    description: z.string().max(1000).optional().nullable(),
    placeholder: z.string().optional().nullable(),
    isRequired: z.boolean().optional(),
    index: z.string().optional(),
    options: z.array(fieldOptionModel).optional().nullable(),
});

export const updateFieldOutputModel = z.object({
    id: z.string(),
});

// ── deleteField ──────────────────────────────────────────────────────────────

export const deleteFieldInputModel = z.object({
    fieldId: z.uuid().describe("UUID of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
    id: z.string(),
});

// ── getFields ─────────────────────────────────────────────────────────────────

export const getFieldsInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to fetch the fields for"),
});

export const fieldOutputModel = z.object({
    id: z.string(),
    formId: z.uuid().nullable(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable(),
    placeholder: z.string().nullable(),
    isRequired: z.boolean(),
    index: z.string(),
    type: fieldTypeEnum,
    options: z.array(fieldOptionModel).nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export const getFieldsOutputModel = z.array(fieldOutputModel);

// ── types ────────────────────────────────────────────────────────────────────

export type CreateFieldInputModel = z.infer<typeof createFieldInputModel>;
export type CreateFieldOutputModel = z.infer<typeof createFieldOutputModel>;
export type UpdateFieldInputModel = z.infer<typeof updateFieldInputModel>;
export type UpdateFieldOutputModel = z.infer<typeof updateFieldOutputModel>;
export type DeleteFieldInputModel = z.infer<typeof deleteFieldInputModel>;
export type DeleteFieldOutputModel = z.infer<typeof deleteFieldOutputModel>;
export type GetFieldsInputModel = z.infer<typeof getFieldsInputModel>;
export type GetFieldsOutputModel = z.infer<typeof getFieldsOutputModel>;
