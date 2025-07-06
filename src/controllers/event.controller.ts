import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utills/intercace";
import response from "../utills/response";
import EventModel, { TypeEvent, eventDAO } from "../models/event.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const payload = { ...req.body, createdBy: req.user?.id } as TypeEvent;
            await eventDAO.validate(payload);
            const result = await EventModel.create(payload);
            response.success(res, result, "Success Create Event");

        } catch (error: any) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                const value = error.keyValue[field];
                return res.status(400).json({
                    status: 400,
                    message: `${field === "slug" ? "Nama acara" : field} sudah digunakan.`,
                    field,
                    value,
                    code: 11000,
                });
            }

            response.error(res, error, "Failed to create event");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Event Find All");
        console.log("--------------------------------------");

        try {
            const {
                limit = "10",
                page = "1",
                search,
                category,
                isOnline,
                isFeatured,
                isPublish
            } = req.query;

            const parsedLimit = parseInt(limit as string, 10);
            const parsedPage = parseInt(page as string, 10);

            const buildQuery = () => {
                const query: FilterQuery<TypeEvent> = {};

                if (search) query.$text = { $search: search as string };
                if (category) query.category = category;
                if (isOnline !== undefined) query.isOnline = isOnline === "true";
                if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
                if (isPublish !== undefined) query.isPublish = isPublish === "true";

                return query;
            };

            const query = buildQuery();

            console.log("MongoDB Query:", JSON.stringify(query, null, 2));

            const [result, count] = await Promise.all([
                EventModel.find(query)
                    .limit(parsedLimit)
                    .skip((parsedPage - 1) * parsedLimit)
                    .sort({ createdAt: -1 })
                    .exec(),
                EventModel.countDocuments(query)
            ]);

            console.log("--------------------------------------");
            console.log("Query Result Count:", result.length);
            console.log("Total Documents:", count);
            console.log("--------------------------------------");

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / parsedLimit),
                current: parsedPage
            }, "Success find All Event");

        } catch (error) {
            console.error("FindAll Error:", error);
            response.error(res, error, "Failed to fetch events");
        }
    },



    // async findAll(req: IReqUser, res: Response) {
    //     console.log("--------------------------------------");
    //     console.log("Masuk di controller Event Find All");
    //     console.log("--------------------------------------");
    //     try {
    //         const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery;

    //         const query: FilterQuery<TypeEvent> = {};

    //         if (search) {
    //             Object.assign(query, {
    //                 ...query,
    //                 $text: {
    //                     $search: search,
    //                 },
    //             });
    //         }
    //         console.log("MongoDB Query:", JSON.stringify(query, null, 2));

    //         // const result = await EventModel.find(query)
    //         //     .limit(limit)
    //         //     .skip((page - 1) * limit)
    //         //     .sort({ createdAt: -1 })
    //         //     .exec();
    //         // const count = await EventModel.countDocuments(query);


    //         const [result, count] = await Promise.all([
    //             EventModel.find(query)
    //                 .limit(limit)
    //                 .skip((page - 1) * limit)
    //                 .sort({ createdAt: -1 })
    //                 .exec(),
    //             EventModel.countDocuments(query)
    //         ]);

    //         console.log("--------------------------------------");
    //         console.log("Query Result Count:", result.length);
    //         console.log("Total Documents:", count);
    //         console.log("--------------------------------------");

    //         response.pagination(res, result, {
    //             total: count,
    //             totalPages: Math.ceil(count / limit),
    //             current: page
    //         }, "Success find All Event");

    //     } catch (error) {
    //         response.error(res, error, "Failed to create event");
    //     }
    // },


    async findOne(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Event Find One");
        console.log("--------------------------------------");
        const { id } = req.params;
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [UPDATE] Invalid ID:", id);
                return response.notFound(res, '[UPDATE] Invalid ID');
            }

            const result = await EventModel.findById(id);

            if (!result) {
                console.warn("⚠️ [FIND ONE] Not found:", id);
                return response.notFound(res, '[FIND ONE] Not found:');
            }

            response.success(res, result, "Success find one Event");
        } catch (error) {
            response.error(res, error, "Failed find one Event");
        }
    },

    async Update(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Event Updated");
        console.log("--------------------------------------");
        const { id } = req.params;
        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [UPDATE] Invalid ID:", id);
                return response.notFound(res, '[UPDATE] Invalid ID');
            }

            const result = await EventModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!result) {
                console.warn("⚠️ [UPDATE] Not found for update:", id);
                return response.notFound(res, 'Not found for update');
            }

            console.log("--------------------------------------");
            response.success(res, result, "Success update Event");
        } catch (error) {
            response.error(res, error, "Failed to update event");
        }
    },

    async remove(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Event Remove");
        console.log("--------------------------------------");
        const { id } = req.params;

        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [REMOVE] Invalid ID:", id);
                return response.notFound(res, '[REMOVE] Invalid ID');
            }

            const result = await EventModel.findByIdAndDelete(id, {
                new: true
            });

            if (!result) {
                console.warn("⚠️ [REMOVE] Not found for Remove:", id);
                return response.notFound(res, 'Not found for Remove');
            }

            console.log("Remove by id : ", id);
            console.log("result : ", result);
            console.log("--------------------------------------");
            response.success(res, result, "Success remove Event");
        } catch (error) {
            response.error(res, error, "Failed to remove event");
        }
    },

    async findOneBySlug(req: IReqUser, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller Event find One By Slug");
        console.log("--------------------------------------");
        try {
            const { slug } = req.params;
            const result = await EventModel.findOne({ slug });

            console.log("Find by slug : ", slug);
            console.log("result : ", result);
            console.log("--------------------------------------");
            response.success(res, result, "Success find by slug");
        } catch (error) {
            response.error(res, error, "Failed find by slug");
        }
    },
};