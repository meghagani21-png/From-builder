import { z } from "zod";

export const submissionValue = z.object({
    fieldId: z.uuid().describe("UUID of the form field"),
    value: z.string().describe("Submitted value as string"),
});

export const createSubmissionInput = z.object({
    formId: z.uuid().describe("UUID of the form"),
    values: z.array(submissionValue).describe("Array of field/value pairs"),
});

export const createSubmissionOutput = z.object({
    id: z.string().describe("ID of the created submission"),
    createdAt: z.string().nullable().describe("Creation timestamp"),
});

export type CreateSubmissionInputType = z.infer<typeof createSubmissionInput>;
export type CreateSubmissionOutputType = z.infer<typeof createSubmissionOutput>;
