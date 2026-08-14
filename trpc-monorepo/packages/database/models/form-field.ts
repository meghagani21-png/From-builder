import {
    pgTable,
    uuid,
    timestamp,
    varchar,
    pgEnum,
    text,
    boolean,
    numeric,
    json,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FieldOption {
    label: string;
    value: string;
}

export const fieldTypeEnum = pgEnum("field_type_enum", [
    "TEXT",
    "EMAIL",
    "NUMBER",
    "YES_NO",
    "PASSWORD",
    "MULTIPLE_CHOICE",
]);

export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),

    description: text("description"),

    placeholder: text("placeholder"),
    isRequired: boolean("is_required").default(false).notNull(),

    index: numeric("index").notNull(),
    type: fieldTypeEnum("type").notNull(),

    options: json("options").$type<FieldOption[]>(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
