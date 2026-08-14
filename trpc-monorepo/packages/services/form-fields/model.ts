import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD", "MULTIPLE_CHOICE"]);

export const fieldOptionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

export const createFieldInput = z.object({
    label: z.string().max(100).describe("Display label for the field"),
    type: fieldTypeEnum.describe("Type of the field"),
    formId: z.uuid().describe("UUID of the form this field belongs to"),
    description: z.string().optional().describe("Helper text shown below the field"),
    placeholder: z.string().optional().describe("Placeholder text for the field"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
    options: z.array(fieldOptionSchema).optional().describe("Options for MULTIPLE_CHOICE fields"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z.object({
    fieldId: z.uuid().describe("UUID of the field to update"),
    label: z.string().max(100).optional(),
    description: z.string().optional().nullable(),
    placeholder: z.string().optional().nullable(),
    isRequired: z.boolean().optional(),
    options: z.array(fieldOptionSchema).optional().nullable(),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const deleteFieldInput = z.object({
    fieldId: z.uuid().describe("UUID of the field to delete"),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const getFieldsInput = z.object({
    formId: z.uuid().describe("UUID of the form to fetch the fields for"),
});

export type GetFieldsInputType = z.infer<typeof getFieldsInput>;
