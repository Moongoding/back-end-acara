import { Response } from "express";
import { IReqUser } from "../utills/intercace";
import uploader from "../utills/uploader";
import response from "../utills/response";

export default {
    async single(req: IReqUser, res: Response) {
        console.log("📥 [UPLOAD SINGLE] Incoming request file:", req.file);

        if (!req.file) {
            console.warn("⚠️ [UPLOAD SINGLE] No file provided");
            return response.error(res, null, "File is not exist");
        }

        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File);
            console.log("✅ [UPLOAD SINGLE] Upload success:", result);

            response.success(res, result, "Success upload your file");
        } catch (error) {
            console.error("❌ [UPLOAD SINGLE] Upload failed:", error);
            response.error(res, null, "Failed Upload a file");
        }
    },

    async multiple(req: IReqUser, res: Response) {
        console.log("📥 [UPLOAD MULTIPLE] Incoming files:", req.files);

        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            console.warn("⚠️ [UPLOAD MULTIPLE] No files provided");
            return response.error(res, null, "Files is not exist");
        }

        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
            console.log("✅ [UPLOAD MULTIPLE] Upload success:", result);

            response.success(res, result, "Success upload your files");
        } catch (error) {
            console.error("❌ [UPLOAD MULTIPLE] Upload failed:", error);
            response.error(res, null, "Failed upload files");
        }
    },

    async remove(req: IReqUser, res: Response) {
        console.log("📥 [REMOVE FILE] Request body:", req.body);

        try {
            const { fileUrl } = req.body as { fileUrl: string };
            console.log("🗑️ [REMOVE FILE] File URL to remove:", fileUrl);

            const result = await uploader.remove(fileUrl);
            console.log("✅ [REMOVE FILE] File removed:", result);

            response.success(res, result, "Success Remove file");
        } catch (error) {
            console.error("❌ [REMOVE FILE] Remove failed:", error);
            response.error(res, null, "Failed Remove file");
        }
    },
};
