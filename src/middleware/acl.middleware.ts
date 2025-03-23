import { Response, NextFunction } from "express";
import { IReqUser } from "../utills/intercace";

export default (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction) => {
        console.log("ACL Middleware Dijalankan!");
        const role = req.user?.role;



        console.log("Role user saat ini:", role);
        console.log("Roles yang diizinkan:", roles);

        if (!role || !roles.includes(role)) {
            return res.status(403).json({
                data: null,
                message: "Forbidden",
            });
        }
        next();
    };
}; 