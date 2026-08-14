import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formSubmissionServices as formSubmissionService } from "../../services";

import {
    createSubmissionInputModel,
    createSubmissionOutputModel,
    getSubmissionsByFormIdInputModel,
    getSubmissionsByFormIdOutputModel,
} from "./model";

const TAGS = ["FormSubmission"];
const getPath = generatePath("/form-submission");

export const formSubmissionRouter = router({
    createSubmission: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createSubmission"),
                tags: TAGS,
            },
        })
        .input(createSubmissionInputModel)
        .output(createSubmissionOutputModel)
        .mutation(async ({ input }) => {
            return await formSubmissionService.createSubmission(input as any);
        }),

    getSubmissionsByFormId: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getSubmissionsByFormId"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getSubmissionsByFormIdInputModel)
        .output(getSubmissionsByFormIdOutputModel)
        .query(async ({ input }) => {
            const { formId } = input;

            return await formSubmissionService.getSubmissionsByFormId(formId);
        }),
});

export default formSubmissionRouter;