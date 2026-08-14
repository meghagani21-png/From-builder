import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formFieldService } from "../../services";

import {
    createFieldInputModel,
    createFieldOutputModel,
    updateFieldInputModel,
    updateFieldOutputModel,
    deleteFieldInputModel,
    deleteFieldOutputModel,
    getFieldsInputModel,
    getFieldsOutputModel,
} from "./model";

const TAGS = ["FormField"];
const getPath = generatePath("/form-field");

export const formFieldRouter = router({
    createField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({ input }) => {
            return await formFieldService.createField(input);
        }),

    updateField: authenticatedProcedure
        .meta({
            openapi: {
                method: "PATCH",
                path: getPath("/updateField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({ input }) => {
            return await formFieldService.updateField(input);
        }),

    deleteField: authenticatedProcedure
        .meta({
            openapi: {
                method: "DELETE",
                path: getPath("/deleteField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({ input }) => {
            return await formFieldService.deleteField(input);
        }),

    getFields: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFields"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({ input }) => {
            const { formId } = input;
            return await formFieldService.getFields(formId);
        }),
});
