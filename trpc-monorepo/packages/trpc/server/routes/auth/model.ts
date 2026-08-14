import {z} from "zod";

export const CreateUserWithEmailandpasswordInputModel = z.object({
    fullname: z.string().describe("full name of the user"),
    email: z.string().describe("email of the user"),
    password: z.string().describe("password of the user")
});

export const CreateUserWithEmailandpasswordOutputModel = z.object({
    id: z.string().describe("Id of the user")
});

export const signInUserWithEmailAndPasswordInputModel= z.object({
    email:z.email().describe("email of the user"),
    password:z.string().describe("password of the user")
});
export const signInUserWithEmailAndPasswordOutputModel =z.object({
    id: z.string().describe("ID of the user"),
});

export const getLoggedUserInfoInputModel = z.object();

export const getLoggedUserInfoOutputModel = z.object({
     id: z.string().describe("ID of the user"),
     fullName: z.string().describe("name of the user"),
     email: z.email().describe("email of the user")

});
   
