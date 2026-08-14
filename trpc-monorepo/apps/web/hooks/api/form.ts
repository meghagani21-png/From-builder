import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    };
};

export const useListForms = () => {
    const {
        data: forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = (trpc.form as any).listForms.useQuery();

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useGetFormWithFields = (formId: string) => {
    const {
        data: form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = (trpc.form as any).getFormWithFields.useQuery({ formId });

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useDeleteForm = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: deleteFormAsync,
        isPending,
        error,
    } = (trpc.form as any).deleteForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { deleteFormAsync, isPending, error };
};

export const useUpdateForm = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: updateFormAsync,
        isPending,
        error,
    } = (trpc.form as any).updateForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { updateFormAsync, isPending, error };
};
