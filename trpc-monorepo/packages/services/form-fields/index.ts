import { db, eq, max } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import {
    createFieldInput,
    updateFieldInput,
    deleteFieldInput,
    type CreateFieldInputType,
    type UpdateFieldInputType,
    type DeleteFieldInputType,
} from "./model";

function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

export default class FormFieldService {
    private async getNextIndex(formId: string): Promise<string> {
        const result = await db
            .select({ maxIndex: max(formFieldsTable.index) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        const current = result[0]?.maxIndex;
        const next = current ? Number(current) + 1 : 1;
        return next.toString();
    }

    public async createField(payload: CreateFieldInputType) {
        const { label, type, formId, description, placeholder, isRequired, options } =
            await createFieldInput.parseAsync(payload);

        const labelKey = toLabelKey(label);
        const index = await this.getNextIndex(formId);

        const result = await db
            .insert(formFieldsTable)
            .values({
                label,
                labelKey,
                type,
                formId,
                description,
                placeholder,
                isRequired,
                index,
                options: options ?? null,
            })
            .returning({ id: formFieldsTable.id });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Something went wrong while creating the field");

        return { id: result[0].id, labelKey, index };
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { fieldId, label, description, placeholder, isRequired, options } =
            await updateFieldInput.parseAsync(payload);

        const updateValues: Record<string, unknown> = {};
        if (label !== undefined) {
            updateValues.label = label;
            updateValues.labelKey = toLabelKey(label);
        }
        if (description !== undefined) updateValues.description = description;
        if (placeholder !== undefined) updateValues.placeholder = placeholder;
        if (isRequired !== undefined) updateValues.isRequired = isRequired;
        if (options !== undefined) updateValues.options = options;
        // handle index for reordering
        const rawPayload = payload as any;
        if (rawPayload.index !== undefined) updateValues.index = rawPayload.index;

        const result = await db
            .update(formFieldsTable)
            .set(updateValues)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({ id: formFieldsTable.id });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Field not found or update failed");

        return { id: result[0].id };
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const { fieldId } = await deleteFieldInput.parseAsync(payload);

        const result = await db
            .delete(formFieldsTable)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({ id: formFieldsTable.id });

        if (!result || result.length === 0)
            throw new Error("Field not found or already deleted");

        return { id: result[0]!.id };
    }

    public async getFields(formId: string) {
        const result = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(formFieldsTable.index);

        return result.map((r) => ({
            id: r.id,
            formId: r.formId,
            label: r.label,
            labelKey: r.labelKey,
            description: r.description ?? null,
            placeholder: r.placeholder ?? null,
            isRequired: r.isRequired,
            index: r.index.toString(),
            type: r.type,
            options: (r.options as Array<{ label: string; value: string }> | null) ?? null,
            createdAt: r.createdAt ? r.createdAt.toISOString() : null,
            updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
        }));
    }
}
