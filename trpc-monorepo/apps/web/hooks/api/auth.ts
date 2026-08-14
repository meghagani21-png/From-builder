import { trpc } from "~/trpc/client";

export function useSignup(){
    const utils = trpc.useUtils();
    const {
        mutateAsync : createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.auth.CreateUserWithEmailandpassword.useMutation({
        onSuccess: async()=>{
        await utils.auth.getLoggedUserInfo.invalidate();
        }
    });


    return{
         createUserWithEmailAndPasswordAsync,
         createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    };
}

export function useSignin(){
    const utils = trpc.useUtils();
    const {
        mutateAsync : signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: async()=>{
        await utils.auth.getLoggedUserInfo.invalidate();
        }
    });


    return{
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    };
}


export function useUser(){
    const {
        data: user,
        error, 
        isFetched,
        isLoading, 
        fetchStatus,
        status,
    } = trpc.auth.getLoggedUserInfo.useQuery({});

    return{
       user,
        error, 
        isFetched,
        isLoading, 
        fetchStatus,
        status,
    };
}
export function useSignout() {
    const utils = trpc.useUtils();
    const {
        mutateAsync: signOutAsync,
        mutate: signOut,
        isPending,
        error,
        isSuccess,
    } = trpc.auth.signOut.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedUserInfo.invalidate();
        },
    });

    return { signOutAsync, signOut, isPending, error, isSuccess };
}




