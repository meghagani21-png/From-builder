import type {Request, Response, CookieOptions}  from "express";

export function setCookie(res: Response, name: string, value: string, opts:CookieOptions){
    res.cookie(name,value,opts)
}



export function getCookie(req: Request, name: string): string| undefined{
       return req.cookies?.[name];
}



export function clearCookie(res: Response, name: string){
    return res.clearCookie(name)
}


/*
path: '/'
httponly: true,
maxAge,
*/