import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utills/intercace";
import response from "../utills/response";
import BannerModel, { TypeBanner, bannerDao } from "../models/banner.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        console.log("📥 [CREATE] Body request:", req.body);
        try {
            await bannerDao.validate(req.body);
            const result = await BannerModel.create(req.body);
            console.log("✅ [CREATE] Banner created:", result);

            response.success(res, result, 'Success to create Banner');
        } catch (error) {
            console.error("❌ [CREATE] Error:", error);
            response.error(res, error, "Failed to create banner");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        console.log("📥 [FIND ALL] Query request:", req.query);
        try {
            const {
                limit = 10,
                page = 1,
                search,
            } = req.query as unknown as IPaginationQuery;

            console.log("🔎 [FIND ALL] Parsed query:", { limit, page, search });

            const query: FilterQuery<TypeBanner> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: {
                        $search: search,
                    },
                });
                console.log("🔍 [FIND ALL] Search applied in query:", query);
            }

            const result = await BannerModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .exec();
            const count = await BannerModel.countDocuments(query);

            console.log("✅ [FIND ALL] Found:", result.length, "Total:", count);

            response.pagination(res, result, {
                total: count,
                current: page,
                totalPages: Math.ceil(count / limit)
            }, "Succes find All Banners");

        } catch (error) {
            console.error("❌ [FIND ALL] Error:", error);
            response.error(res, error, 'Failed to Find All Banners');
        }
    },

    async findOne(req: IReqUser, res: Response) {
        const { id } = req.params;
        console.log("📥 [FIND ONE] ID:", id);
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [FIND ONE] Invalid ID:", id);
                return response.notFound(res, '[FIND ONE] Invalid ID:');
            }
            const result = await BannerModel.findById(id);
            if (!result) {
                console.warn("⚠️ [FIND ONE] Not found:", id);
                return response.notFound(res, '[FIND ONE] Not found:');
            }

            console.log("✅ [FIND ONE] Found:", result);
            response.success(res, result, "success find Banner");
        } catch (error) {
            console.error("❌ [FIND ONE] Error:", error);
            response.error(res, error, "Failed to find banner");
        }
    },

    async update(req: IReqUser, res: Response) {
        const { id } = req.params;
        console.log("📥 [UPDATE] ID:", id, "Body:", req.body);
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [UPDATE] Invalid ID:", id);
                return response.notFound(res, '[UPDATE] Invalid ID');
            }

            const result = await BannerModel.findByIdAndUpdate(id, req.body, {
                new: true
            });

            if (!result) {
                console.warn("⚠️ [UPDATE] Not found for update:", id);
                return response.notFound(res, 'Not found for update');
            }

            console.log("✅ [UPDATE] Updated:", result);
            response.success(res, result, "success to Update Banner");
        } catch (error) {
            console.error("❌ [UPDATE] Error:", error);
            response.error(res, error, "Failed to Update banners");
        }
    },

    async remove(req: IReqUser, res: Response) {
        const { id } = req.params;
        console.log("📥 [REMOVE] ID:", id);
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [REMOVE] Invalid ID:", id);
                return response.notFound(res, '[REMOVE] Invalid ID');
            }

            const result = await BannerModel.findByIdAndDelete(id, {
                new: true
            });

            if (!result) {
                console.warn("⚠️ [REMOVE] Not found for Remove:", id);
                return response.notFound(res, 'Not found for Remove');
            }

            console.log("✅ [REMOVE] Deleted:", result);
            response.success(res, result, "success to remove Banner");
        } catch (error) {
            console.error("❌ [REMOVE] Error:", error);
            response.error(res, error, "Failed to remove banner");
        }
    },
}
