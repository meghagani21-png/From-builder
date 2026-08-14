import { trpc } from "~/trpc/client";

const trpcAny = trpc as any;

export const useCreateSubmission = () => {
    const {
        mutateAsync: createSubmissionAsync,
        mutate: createSubmission,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpcAny.formSubmission.createSubmission.useMutation({});

    return { createSubmissionAsync, createSubmission, error, failureCount, isError, isIdle, isSuccess, status };
};

export const useGetSubmissionsByFormId = (formId: string) => {
    const {
        data: submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpcAny.formSubmission.getSubmissionsByFormId.useQuery({ formId });

    return { submissions, error, isFetched, isFetching, isLoading, status };
};
