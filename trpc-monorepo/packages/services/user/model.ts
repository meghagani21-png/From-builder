import {z } from "zod";
export const CreateUserWithEmailandpassword = z.object({
    fullname: z.string().describe("Full nmae of the user"),
    email: z.email().describe("email of th epasswi"),
    password:z.string().describe("password of the user"),
});


export type CreateUserEmailAndPasswordType =  z.infer<typeof CreateUserWithEmailandpassword>;


export const generateUserTokenplayload = z.object({
    id: z.string().describe("ID of the user"),
})

export type generateUserTokenplayloadType =z.infer<typeof generateUserTokenplayload>;


export const signInWithEmailAndPassword = z.object({
     email: z.email().describe("email of the user"),
     password:z.string().describe("password of the user"),
});


export type signInWithEmailAndPassword = z.infer<typeof
signInWithEmailAndPassword>;

