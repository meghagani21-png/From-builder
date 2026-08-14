import { pgTable, uuid, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 50 }).notNull(),
    description: varchar("description", { length: 300 }),

    // true = allow multiple responses per person; false = only one submission allowed
    allowMultipleSubmissions: boolean("allow_multiple_submissions").notNull().default(true),

    createdBy: uuid("created_by").references(() => usersTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
