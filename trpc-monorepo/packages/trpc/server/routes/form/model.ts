import { z } from "zod";

export const CreateFormInputModel = z.object({
    title: z.string().max(55).describe("title of the form"),
    description: z.string().max(300).optional().describe("description of the form"),
});

export const CreateFromOutputModel = z.object({
    id: z.string().describe("Id of the created form"),
});

export const UpdateFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form"),
    title: z.string().max(55).optional().describe("New title"),
    description: z.string().max(300).nullable().optional().describe("New description"),
    allowMultipleSubmissions: z.boolean().optional().describe("Whether multiple submissions are allowed"),
});

export const UpdateFormOutputModel = z.object({
    id: z.string(),
});

export const DeleteFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to delete"),
});

export const DeleteFormOutputModel = z.object({
    id: z.string(),
});

export const listFormsInputModel = z.undefined();
export const listFormsOutputModel = z.array(
    z.object({
        id: z.string().describe("ID of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),
        allowMultipleSubmissions: z.boolean().describe("Whether multiple submissions are allowed"),
        createdAt: z.date().nullable().describe("Creation timestamp"),
        updatedAt: z.date().nullable().describe("Last updated timestamp"),
        responseCount: z.number().describe("Number of form submissions"),
    }),
);

export const getFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to fetch"),
});

const fieldTypeEnum = z.enum([
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

export const fieldOutputModel = z.object({
    id: z.string().describe("ID of the field"),
    formId: z.string().nullable().optional(),
    label: z.string().describe("Label of the field"),
    labelKey: z.string().optional(),
    type: fieldTypeEnum.describe("Type of the field"),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    index: z.string().optional(),
    options: z.array(fieldOptionModel).nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export const getFormOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    allowMultipleSubmissions: z.boolean(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    fields: z.array(fieldOutputModel),
});
