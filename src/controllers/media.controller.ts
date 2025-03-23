import { Response } from "express";
import { IReqUser } from "../utills/intercace";
import uploader from "../utills/uploader";
import { json } from "body-parser";


export default {
    async single(req: IReqUser, res: Response) {
        // Langsung tolak dlu klo ga bawa file
        if (!req.file) {
            return res.status(400).json({
                data: null,
                message: "File is not exist"
            });
        }

        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File);
            res.status(200).json({
                data: result,
                message: "Success upload your file",
            });
        } catch {
            res.status(500).json({
                data: null,
                message: "Failed upload your file",
            });
        }
    },

    async multiple(req: IReqUser, res: Response) {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                data: null,
                message: "Files is not exist"
            });
        }

        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
            res.status(200).json({
                data: result,
                message: "Success upload your files",
            });
        } catch {
            res.status(500).json({
                data: null,
                message: "Failed upload your files",
            });
        }
    },

    async remove(req: IReqUser, res: Response) {
        try {
            const { fileUrl } = req.body as { fileUrl: string };
            const result = await uploader.remove(fileUrl);
            res.status(200).json({
                data: result,
                message: "Success remove file"
            })
        } catch {
            res.status(500).json({
                data: null,
                message: "Failed remove file"
            })
        }
    },
};