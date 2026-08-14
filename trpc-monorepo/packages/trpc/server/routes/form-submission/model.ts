import { z } from "zod";

export const submissionValueModel = z.object({
    fieldId: z.uuid(),
    value: z.string(),
});

export const createSubmissionInputModel = z.object({
    formId: z.uuid(),
    values: z.array(submissionValueModel),
});

export const createSubmissionOutputModel = z.object({
    id: z.string(),
    createdAt: z.string().nullable(),
});

export const getSubmissionsByFormIdInputModel = z.object({
    formId: z.uuid().describe("UUID of the form"),
});

export const getSubmissionsByFormIdOutputModel = z.array(
    z.object({
        id: z.string(),
        formId: z.uuid().nullable(),
        values: z.array(
            z.object({
                fieldId: z.uuid(),
                value: z.string(),
            }),
        ),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
    }),
);

export type CreateSubmissionInputModel = z.infer<typeof createSubmissionInputModel>;
export type CreateSubmissionOutputModel = z.infer<typeof createSubmissionOutputModel>;
export type GetSubmissionsByFormIdInputModel = z.infer<typeof getSubmissionsByFormIdInputModel>;
export type GetSubmissionsByFormIdOutputModel = z.infer<typeof getSubmissionsByFormIdOutputModel>;
