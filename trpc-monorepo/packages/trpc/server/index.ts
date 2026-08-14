import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route"
import { formFieldRouter } from "./routes/form-field/route";
import formSubmissionRouter from "./routes/form-submission/route";




export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  formFields: formFieldRouter,
  formSubmission: formSubmissionRouter
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
