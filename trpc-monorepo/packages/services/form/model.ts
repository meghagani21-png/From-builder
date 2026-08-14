import {z} from "zod";

export const createFromInput = z.object({
    title: z.string().max(50).describe("Title of the form"),
    description: z.string().max(300).optional().describe("description of the from"),
    createdBy : z.uuid().describe("UUID OF THE creator")
})  


export type CreateFormInputType = z.infer<typeof createFromInput>;

export const listFormsbyUserIdInput = z.object({
    userId : z.uuid().describe("UUID OF THE USER"),

});

export type listFormsbyUserIdInputType = z.infer<typeof listFormsbyUserIdInput>;
