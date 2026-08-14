import { db, eq } from "@repo/database";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import { createSubmissionInput, type CreateSubmissionInputType } from "./model";

export default class FormSubmissionService {
    public async createSubmission(payload: CreateSubmissionInputType) {
        const { formId, values } = await createSubmissionInput.parseAsync(payload);

        const result = await db
            .insert(formSubmissionsTable)
            .values({ formId, values })
            .returning({ id: formSubmissionsTable.id, createdAt: formSubmissionsTable.createdAt });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Something went wrong while creating the submission");

        return {
            id: result[0].id,
            createdAt: result[0].createdAt ? result[0].createdAt.toISOString() : null,
        };
    }

    public async getSubmissionsByFormId(formId: string) {
        const rows = await db
            .select({
                id: formSubmissionsTable.id,
                formId: formSubmissionsTable.formId,
                values: formSubmissionsTable.values,
                createdAt: formSubmissionsTable.createdAt,
                updatedAt: formSubmissionsTable.updatedAt,
            })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId))
            .orderBy(formSubmissionsTable.createdAt);

        return rows.map((r) => ({
            id: r.id,
            formId: r.formId,
            values: r.values ?? [],
            createdAt: r.createdAt ? r.createdAt.toISOString() : null,
            updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
        }));
    }
}
