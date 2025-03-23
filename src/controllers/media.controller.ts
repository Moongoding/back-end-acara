import { Response } from "express";
import { IReqUser } from "../utills/intercace";
import uploader from "../utills/uploader";
import { json } from "body-parser";
import response from "../utills/response";


export default {
    async single(req: IReqUser, res: Response) {
        // Langsung tolak dlu klo ga bawa file
        if (!req.file) {
            return response.error(res, null, "File is not exist");
        }

        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File);
            response.success(res, result, "Success upload your file");
        } catch {
            response.error(res, null, "Failed Upload a file");
        }
    },

    async multiple(req: IReqUser, res: Response) {
        if (!req.files || req.files.length === 0) {
            return response.error(res, null, "Files is not exist");
        }

        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
            response.success(res, result, " Success upload your files");
        } catch {
            response.error(res, null, "Failed upload files");
        }
    },

    async remove(req: IReqUser, res: Response) {
        try {
            const { fileUrl } = req.body as { fileUrl: string };
            const result = await uploader.remove(fileUrl);
            response.success(res, result, "Success Remove file");
        } catch {
            response.error(res, null, "Failed Remove file");
        }
    },
};