import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formServices } from "../../services";
import { z } from "zod";

import {
    CreateFormInputModel,
    CreateFromOutputModel,
    listFormsInputModel,
    listFormsOutputModel,
    getFormInputModel,
    getFormOutputModel,
    UpdateFormInputModel,
    UpdateFormOutputModel,
    DeleteFormInputModel,
    DeleteFormOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
    createForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(CreateFormInputModel)
        .output(CreateFromOutputModel)
        .mutation(async function ({ input, ctx }: { input: z.infer<typeof CreateFormInputModel>; ctx: any; }) {
            const { title, description } = input;

            const { id } = await formServices.createForm({
                title,
                description,
                createdBy: ctx.user.id,
            });

            return { id };
        }),
    listForms: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/listForms"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(listFormsInputModel)
        .output(listFormsOutputModel)
        .query(async ({ ctx }) => {
            const forms = await formServices.listFormsByUserId({ userId: ctx.user.id });
            return forms;
        }),
    getFormWithFields: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getForm"),
                tags: TAGS,
            },
        })
        .input(getFormInputModel)
        .output( getFormOutputModel)
        .query(async ({ input }) => {
            const { formId } = input;
            const form = await formServices.getFormWithFields(formId);
            return form;
        }),

    updateForm: authenticatedProcedure
        .meta({
            openapi: { method: "PATCH", path: getPath("/updateForm"), tags: TAGS, protect: true },
        })
        .input(UpdateFormInputModel)
        .output(UpdateFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { formId, title, description, allowMultipleSubmissions } = input;
            return await formServices.updateForm(formId, ctx.user.id, { title, description, allowMultipleSubmissions });
        }),

    deleteForm: authenticatedProcedure
        .meta({
            openapi: { method: "DELETE", path: getPath("/deleteForm"), tags: TAGS, protect: true },
        })
        .input(DeleteFormInputModel)
        .output(DeleteFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return await formServices.deleteForm(input.formId, ctx.user.id);
        }),
});
