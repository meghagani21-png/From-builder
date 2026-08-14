import { trpc } from "~/trpc/client";

export const useCreateField = (formId?: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFieldAsync,
        mutate: createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.formFields.createField.useMutation({
        onSuccess: async () => {
            // invalidate all field queries so UI refreshes immediately without page reload
            await utils.formFields.invalidate();
            await utils.form.invalidate();
        },
    });

    return { createFieldAsync, createField, error, failureCount, isError, isIdle, isSuccess, status };
};

export const useUpdateField = (formId?: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: updateFieldAsync,
        mutate: updateField,
        error,
        status,
        isSuccess,
    } = trpc.formFields.updateField.useMutation({
        onSuccess: async () => {
            await utils.formFields.invalidate();
            await utils.form.invalidate();
        },
    });

    return { updateFieldAsync, updateField, error, status, isSuccess };
};

export const useDeleteField = (formId?: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: deleteFieldAsync,
        mutate: deleteField,
        error,
        status,
        isSuccess,
    } = trpc.formFields.deleteField.useMutation({
        onSuccess: async () => {
            await utils.formFields.invalidate();
            await utils.form.invalidate();
        },
    });

    return { deleteFieldAsync, deleteField, error, status, isSuccess };
};

export const useGetFields = (formId: string) => {
    const {
        data: fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.formFields.getFields.useQuery({ formId });

    return { fields, error, isFetched, isFetching, isLoading, status };
};
