import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utills/jwt";
import { IReqUser } from "../utills/intercace";
import response from "../utills/response";



export default (req: Request, res: Response, next: NextFunction) => {
    console.log("--------------------------------------");
    console.log("auth.middleware is running!");
    console.log("--------------------------------------");
    const authorization = req.headers.authorization;
    if (!authorization) {
        return response.unauthorized(res);
    }
    console.log("authorization success : ", authorization);
    console.log("--------------------------------------");

    const [prefix, accessToken] = authorization.split(" ")
    if (!(prefix === "Bearer" && accessToken)) {
        return response.unauthorized(res);
    }

    const user = getUserData(accessToken);
    console.log("Success get user", user);
    if (!user) {
        return response.unauthorized(res);
    }

    (req as IReqUser).user = user;

    next();
}