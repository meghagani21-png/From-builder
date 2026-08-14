import UserService from "@repo/services/user";
import FormServices from "@repo/services/form";
import FormFieldService from "@repo/services/form-fields";
import FormSubmissionService from "@repo/services/form-submission";
export const userService = new UserService();
export const formServices = new FormServices();
export const formFieldService = new FormFieldService();

export const formSubmissionServices = new FormSubmissionService();