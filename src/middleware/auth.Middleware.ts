import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utills/jwt";
import { IReqUser } from "../utills/intercace";



export default (req: Request, res: Response, next: NextFunction) => {
    console.log("auth.middleware is running!");
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }
    console.log("authorization success ", authorization);

    const [prefix, accessToken] = authorization.split(" ")
    if (!(prefix === "Bearer" && accessToken)) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }

    const user = getUserData(accessToken);
    if (!user) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }

    (req as IReqUser).user = user;

    next();
}