import { db, eq, sql, and } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";

import {
    createFromInput,
    type CreateFormInputType,
    listFormsbyUserIdInput,
    type listFormsbyUserIdInputType,
} from "./model";

export default class UserService {
    public async createForm(payload: CreateFormInputType) {
        const { title, description, createdBy } = await createFromInput.parseAsync(payload);

        const result = await db
            .insert(formsTable)
            .values({
                title,
                description,
                createdBy,
            })
            .returning({
                id: formsTable.id,
            });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Something went wrong while creating the form");

        return {
            id: result[0].id,
        };
    }

    public async listFormsByUserId(payload: listFormsbyUserIdInputType) {
        const { userId } = await listFormsbyUserIdInput.parseAsync(payload);

        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                allowMultipleSubmissions: formsTable.allowMultipleSubmissions,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
                responseCount: sql<number>`cast(count(distinct ${formSubmissionsTable.id}) as int)`,
            })
            .from(formsTable)
            .leftJoin(formSubmissionsTable, eq(formSubmissionsTable.formId, formsTable.id))
            .where(eq(formsTable.createdBy, userId))
            .groupBy(
                formsTable.id,
                formsTable.title,
                formsTable.description,
                formsTable.allowMultipleSubmissions,
                formsTable.createdAt,
                formsTable.updatedAt,
            );

        return forms;
    }

    public async updateForm(formId: string, userId: string, payload: { title?: string; description?: string | null; allowMultipleSubmissions?: boolean }) {
        const setValues: Record<string, unknown> = {};
        if (payload.title !== undefined) setValues.title = payload.title;
        if (payload.description !== undefined) setValues.description = payload.description;
        if (payload.allowMultipleSubmissions !== undefined) setValues.allowMultipleSubmissions = payload.allowMultipleSubmissions;

        const result = await db
            .update(formsTable)
            .set(setValues)
            .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
            .returning({ id: formsTable.id });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Form not found or update failed");

        return { id: result[0].id };
    }

    public async deleteForm(formId: string, userId: string) {
        // delete fields and submissions first (cascade safety)
        await db.delete(formSubmissionsTable).where(eq(formSubmissionsTable.formId, formId));
        await db.delete(formFieldsTable).where(eq(formFieldsTable.formId, formId));
        const result = await db
            .delete(formsTable)
            .where(eq(formsTable.id, formId))
            .returning({ id: formsTable.id });

        if (!result || result.length === 0)
            throw new Error("Form not found or already deleted");

        return { id: result[0]!.id };
    }

    public async getFormWithFields(formId: string) {
        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                allowMultipleSubmissions: formsTable.allowMultipleSubmissions,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,

                field_id: formFieldsTable.id,
                field_formId: formFieldsTable.formId,
                field_label: formFieldsTable.label,
                field_labelKey: formFieldsTable.labelKey,
                field_description: formFieldsTable.description,
                field_placeholder: formFieldsTable.placeholder,
                field_isRequired: formFieldsTable.isRequired,
                field_index: formFieldsTable.index,
                field_type: formFieldsTable.type,
                field_options: formFieldsTable.options,
                field_createdAt: formFieldsTable.createdAt,
                field_updatedAt: formFieldsTable.updatedAt,
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
            .where(eq(formsTable.id, formId))
            .orderBy(formFieldsTable.index);

        if (!rows || rows.length === 0) throw new Error(`Form with ID ${formId} not found`);

        const first = rows[0]!;

        const form = {
            id: first.id,
            title: first.title,
            description: first.description ?? null,
            allowMultipleSubmissions: first.allowMultipleSubmissions ?? true,
            createdAt: first.createdAt ? first.createdAt.toISOString() : null,
            updatedAt: first.updatedAt ? first.updatedAt.toISOString() : null,
            fields: [] as Array<any>,
        };

        for (const r of rows) {
            if (!r.field_id) continue;

            form.fields.push({
                id: r.field_id,
                formId: r.field_formId,
                label: r.field_label,
                labelKey: r.field_labelKey,
                description: r.field_description ?? null,
                placeholder: r.field_placeholder ?? null,
                isRequired: r.field_isRequired,
                index: r.field_index!.toString(),
                type: r.field_type,
                options: (r.field_options as Array<{ label: string; value: string }> | null) ?? null,
                createdAt: r.field_createdAt ? r.field_createdAt.toISOString() : null,
                updatedAt: r.field_updatedAt ? r.field_updatedAt.toISOString() : null,
            });
        }

        return form;
    }
}
