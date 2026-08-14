import {
    CreateUserWithEmailandpassword,
    type CreateUserEmailAndPasswordType,
    generateUserTokenplayload,
    generateUserTokenplayloadType,
    signInWithEmailAndPassword
} from "./model";

import { usersTable } from "@repo/database/models/user";
import { db } from "@repo/database";

import { eq } from "drizzle-orm";

import bcrypt from "bcryptjs";
import * as JWT from "jsonwebtoken";

import { env } from "../env";

export default class UserService {

    private async getUserByEmail(email: string) {

        const result = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!result || result.length === 0) {
            return null;
        }

        return result[0];
    }

    private async generateUserTokenplayload(
        payload: generateUserTokenplayloadType
    ) {

        const { id } =
            await generateUserTokenplayload.parseAsync(payload);

        const token = JWT.sign(
            { id },
            env.JWT_SECRET
        );

        return { token };
    }

    public async CreateUserWithEmailandpassword(
        payload: CreateUserEmailAndPasswordType
    ) {

        const {
            fullname,
            email,
            password,
        } = await CreateUserWithEmailandpassword.parseAsync(payload);

        // check existing user
        const existingUser = await this.getUserByEmail(email);

        if (existingUser) {
            throw new Error("user with email already exists");
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // create user
        const result = await db
            .insert(usersTable)
            .values({
                fullName: fullname,
                email,
                passwordHash,
            })
            .returning({
                id: usersTable.id,
            });

        if (
            !result ||
            result.length === 0 ||
            !result[0]?.id
        ) {
            throw new Error("something went wrong");
        }

        // generate token
        const { token } =
            await this.generateUserTokenplayload({
                id: result[0].id,
            });

        return {
            id: result[0].id,
            token,
        };
    }

    public async signInWithEmailAndPassword(payload: signInWithEmailAndPassword) {
        const {email,password} = await signInWithEmailAndPassword.parseAsync(payload);

        const existingUser = await this.getUserByEmail(email);
        if(!existingUser){
            throw new Error("user with email does not exist");
        }
        if(!existingUser.passwordHash){
            throw new Error("invalid authentication method");
        }
        const isValid = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isValid) throw new Error("invalid email adress or password");

        const { token } = await this.generateUserTokenplayload({ id: existingUser.id });

        return {
            id: existingUser.id,
            token,
        };
    }
    public async getUserInfoById(id:string){
        const user = await db.select({id:usersTable.id, fullName:usersTable.fullName,email:usersTable.email}).from(usersTable).where(eq(usersTable.id, id));

        if(!user||user.length === 0) throw new Error("user with thid id does not exists");
        return user[0]!;
    }

    public async verifyAndDecodeUserToken(token:string){ //this can throw the error we can wrap it into the try and catch block
        try{
              const result = JWT.verify(token,env.JWT_SECRET) as generateUserTokenplayloadType;
              return result;
        } catch(err){
            throw new Error("invalid token");
        }
     
    }
}

//pseudocode
//data recieve and validate
//check in db if this email already exists
//hash the password
//create a new user in db
//jwt token, we will set it in cookie
//return