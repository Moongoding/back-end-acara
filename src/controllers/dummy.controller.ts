import {Request, Response} from "express";

export default{
    dummy(req:Request, res:Response){
        res.status(200).json({
            message: "Succses hit endpoint /dummy",
            data: "OK"
        })
    },
};