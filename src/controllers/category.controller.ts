import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utills/intercace";
import CategoryModel, { categoryDAO } from "../models/category.model";
import response from "../utills/response";
import { isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await categoryDAO.validate(req.body);
            const result = await CategoryModel.create(req.body);
            response.success(res, result, "Success create a Category");
        } catch (error) {
            response.error(res, error, "Failed Create Category");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Category Find All");
        console.log("--------------------------------------");
        const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;

        try {
            const query = {};
            if (search) {
                Object.assign(query, {
                    $or: [
                        {
                            name: { $regex: search, $options: "i" },
                        },
                        {
                            description: { $regex: search, $options: "i" },
                        }
                    ]
                });
            }
            console.log("MongoDB Query:", JSON.stringify(query, null, 2));

            // const result = await CategoryModel.find(query)
            //     .limit(limit)
            //     .skip((page - 1) * limit)
            //     .sort({ createdAt: -1 })
            //     .exec();

            // const count = await CategoryModel.countDocuments(query);
            // response.pagination(res, result, {
            //     total: count,
            //     totalPages: Math.ceil(count / limit),
            //     current: page
            // }, "Success find All category");

            // Eksekusi pencarian dan count secara paralel untuk efisiensi
            const [result, count] = await Promise.all([
                CategoryModel.find(query)
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1 })
                    .exec(),
                CategoryModel.countDocuments(query)
            ]);

            console.log("--------------------------------------");
            console.log("Query Result Count:", result.length);
            console.log("Total Documents:", count);
            console.log("--------------------------------------");

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page
            }, "Success find All category");

        } catch (error) {
            response.error(res, error, "Failed Find All Category");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Category Find One");
        console.log("--------------------------------------");
        const { id } = req.params;
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [FIND ONE] Invalid ID:", id);
                return response.notFound(res, '[FIND ONE] Invalid ID:');
            }
            const result = await CategoryModel.findById(id);

            if (!result) {
                console.warn("⚠️ [FIND ONE] Not found:", id);
                return response.notFound(res, '[FIND ONE] Not found:');
            }

            response.success(res, result, "Success find one category");

        } catch (error) {
            response.error(res, error, "Failed Find One Category");
        }
    },

    async update(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Category Updated");
        console.log("--------------------------------------");
        const { id } = req.params;
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [UPDATE] Invalid ID:", id);
                return response.notFound(res, '[UPDATE] Invalid ID');
            }

            const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!result) {
                console.warn("⚠️ [UPDATE] Not found for update:", id);
                return response.notFound(res, 'Not found for update');
            }

            console.log("Update by id : ", id);
            console.log("Request Body : ", req.body);
            console.log("result : ", result);
            console.log("--------------------------------------");
            response.success(res, result, "Success update category");
        } catch (error) {
            response.error(res, error, "Failed Update Category");
        }
    },

    async remove(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Category Remove");
        console.log("--------------------------------------");
        const { id } = req.params;
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [REMOVE] Invalid ID:", id);
                return response.notFound(res, '[REMOVE] Invalid ID');
            }

            const result = await CategoryModel.findByIdAndDelete(id, {
                new: true
            });

            if (!result) {
                console.warn("⚠️ [REMOVE] Not found for Remove:", id);
                return response.notFound(res, 'Not found for Remove');
            }

            console.log("--------------------------------------");
            response.success(res, result, "Success remove category");
        } catch (error) {
            response.error(res, error, "Failed Remove Category");
        }
    },
}