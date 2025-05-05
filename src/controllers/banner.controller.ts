import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utills/intercace";
import response from "../utills/response";
import BannerModel, { TypeBanner, bannerDao } from "../models/banner.model";
import { FilterQuery } from "mongoose";


export default {
    async create(req: IReqUser, res: Response) {
        try {
            await bannerDao.validate(req.body);
            const result = await BannerModel.create(req.body);

            response.success(res, result, 'Success to create Banner');
        } catch (error) {
            response.error(res, error, "Failed to create banner")
        }
    },

    async findAll(req: IReqUser, res: Response) {
        try {
            const {
                limit = 10,
                page = 1,
                search,
            } = req.query as unknown as IPaginationQuery;


            const query: FilterQuery<TypeBanner> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: {
                        $search: search,
                    },
                });
            }

            const result = await BannerModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await BannerModel.countDocuments(query);

            response.pagination(res, result, {
                total: count,
                current: page,
                totalPages: Math.ceil(count / limit)
            }, "Succes find All Banners");

        } catch (error) {
            response.error(res, error, 'Failed to Find All Banners')
        }
    },

    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await BannerModel.findById(id);

            response.success(res, result, "success find Banner");
        } catch (error) {
            response.error(res, error, "Failed to find banner")
        }
    },


    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await BannerModel.findByIdAndUpdate(id, (req.body), {
                new: true
            });

            response.success(res, result, "success to Update Banner");
        } catch (error) {
            response.error(res, error, "Failed to Update banners")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await BannerModel.findByIdAndDelete(id, {
                new: true
            });

            response.success(res, result, "success to remove Banner");
        } catch (error) {
            response.error(res, error, "Failed to remove banner")
        }
    },
}