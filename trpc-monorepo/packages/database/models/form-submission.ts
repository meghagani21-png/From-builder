import { pgTable, uuid, timestamp, json } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FormValue {
    fieldId: string;
    value: string;
}

export type FormValueRow = FormValue[];

export const formSubmissionsTable = pgTable("form_submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id").references(() => formsTable.id),

    values: json("values").$type<FormValueRow>(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
