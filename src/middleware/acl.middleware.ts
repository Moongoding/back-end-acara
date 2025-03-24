import { Response, NextFunction } from "express";
import { IReqUser } from "../utills/intercace";
import response from "../utills/response";

export default (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction) => {
        console.log("--------------------------------------");
        console.log("ACL Middleware is running!");
        console.log("--------------------------------------");
        const role = req.user?.role;



        console.log("Role user saat ini:", role);
        console.log("Roles yang diizinkan:", roles);
        console.log("--------------------------------------");

        if (!role || !roles.includes(role)) {
            return response.unauthorized(res, "forbidden");
        }
        next();
    };
}; 