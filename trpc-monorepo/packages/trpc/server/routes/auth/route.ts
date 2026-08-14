import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";

import {
    CreateUserWithEmailandpasswordInputModel,
    CreateUserWithEmailandpasswordOutputModel,
    getLoggedUserInfoInputModel,
    getLoggedUserInfoOutputModel,
    signInUserWithEmailAndPasswordInputModel,
    signInUserWithEmailAndPasswordOutputModel
} from "./model";

import { userService } from "../../services";
import { generatePath } from "../../utils/path-generator";

const getPath = generatePath("/authentication");
const TAGS = ["Authentication"];

/*
basically it is for the open api documentation purpose
/authentication/createUserWithEmailAndPassword
*/

export const authRouter = router({
    CreateUserWithEmailandpassword : publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/CreateUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(CreateUserWithEmailandpasswordInputModel)
        .output(CreateUserWithEmailandpasswordOutputModel)
        .mutation(async ({ input, ctx }) => {

            const { fullname, email, password } = input;

            const { id, token } =
                await userService.CreateUserWithEmailandpassword({
                    fullname,
                    email,
                    password,
                });

            ctx.setCookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return {
                id,
                fullName: fullname,
                email: email,
            };
        }),
    signInUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/signInUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(signInUserWithEmailAndPasswordInputModel)
        .output(signInUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input;

            const { id, token } = await userService.signInWithEmailAndPassword({
                email,
                password,
            });

            ctx.setCookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return {
                id,
            };
        }),

        getLoggedUserInfo: authenticatedProcedure
            .meta({
                openapi: {
                    method: "GET",
                    path: getPath("/getLoggedUserInfo"),
                    tags: TAGS,
                },
            })
            .input(getLoggedUserInfoInputModel)
            .output(getLoggedUserInfoOutputModel)
            .query(async ({ ctx }) => {
                const { id, fullName, email } = await userService.getUserInfoById(ctx.user.id);
                return {
                    id,
                    fullName,
                    email,
                };
            }),

        signOut: authenticatedProcedure
            .meta({
                openapi: {
                    method: "POST",
                    path: getPath("/signOut"),
                    tags: TAGS,
                    protect: true,
                },
            })
            .input(getLoggedUserInfoInputModel)
            .output(getLoggedUserInfoOutputModel)
            .mutation(async ({ ctx }) => {
                const { id, fullName, email } = await userService.getUserInfoById(ctx.user.id);
                ctx.setCookie("token", "", {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 0,
                });
                return { id, fullName, email };
            }),
    });