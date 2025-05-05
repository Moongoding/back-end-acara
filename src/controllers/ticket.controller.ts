import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utills/intercace";
import response from "../utills/response";
import TicketModel, { TypeTicket, ticketDao } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        console.log("📝 [CREATE TICKET] Request body:", req.body);

        try {
            await ticketDao.validate(req.body);
            const result = await TicketModel.create(req.body);

            console.log("✅ [CREATE TICKET] Ticket created:", result);
            response.success(res, result, 'Success to Create Ticket');
        } catch (error) {
            console.error("❌ [CREATE TICKET] Failed:", error);
            response.error(res, error, 'Failed to Create Ticket');
        }
    },

    async findAll(req: IReqUser, res: Response) {
        console.log("📄 [FIND ALL TICKETS] Query params:", req.query);

        try {
            const {
                limit = 10,
                page = 1,
                search,
            } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<TypeTicket> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: { $search: search },
                });
            }

            console.log("🔍 [FIND ALL TICKETS] Final query:", query);

            const result = await TicketModel.find(query)
                .populate("events")
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await TicketModel.countDocuments(query);

            console.log("✅ [FIND ALL TICKETS] Found:", result.length, "tickets");
            response.pagination(res, result, {
                total: count,
                current: page,
                totalPages: Math.ceil(count / limit)
            }, "Success find All Ticket");
        } catch (error) {
            console.error("❌ [FIND ALL TICKETS] Failed:", error);
            response.error(res, error, 'Failed to Find All Ticket');
        }
    },

    async findOne(req: IReqUser, res: Response) {
        const { id } = req.params;
        console.log("🔎 [FIND ONE TICKET] ID:", id);

        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [FIND ONE TICKET] Invalid ID format");
                return response.notFound(res, '[FIND ONE TICKET] Invalid ID format');
            }

            const result = await TicketModel.findById(id);

            if (!result) {
                console.warn("⚠️ [FIND ONE TICKET] Ticket not found");
                return response.notFound(res, '[FIND ONE TICKET] Ticket not found');
            }

            console.log("✅ [FIND ONE TICKET] Found:", result);
            response.success(res, result, "Success find Ticket");
        } catch (error) {
            console.error("❌ [FIND ONE TICKET] Failed:", error);
            response.error(res, error, 'Failed to Find One Ticket');
        }
    },

    async update(req: IReqUser, res: Response) {
        const { id } = req.params;
        console.log("✏️ [UPDATE TICKET] ID:", id);
        console.log("✏️ [UPDATE TICKET] Body:", req.body);

        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [UPDATE TICKET] Invalid ID");
                return response.notFound(res, '[UPDATE TICKET] Invalid ID');
            }

            const result = await TicketModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!result) {
                console.warn("⚠️ [UPDATE TICKET] Ticket not found");
                return response.notFound(res, '[UPDATE TICKET] Ticket not found');
            }

            console.log("✅ [UPDATE TICKET] Updated:", result);
            response.success(res, result, "Success to Update Ticket");
        } catch (error) {
            console.error("❌ [UPDATE TICKET] Failed:", error);
            response.error(res, error, 'Failed to Update Ticket');
        }
    },

    async remove(req: IReqUser, res: Response) {
        const { id } = req.params;
        console.log("🗑️ [REMOVE TICKET] ID:", id);

        try {
            if (!isValidObjectId(id)) {
                console.warn("⚠️ [REMOVE] Invalid ID:", id);
                return response.notFound(res, '[REMOVE] Invalid ID');
            }

            const result = await TicketModel.findByIdAndDelete(id);

            if (!result) {
                console.warn("⚠️ [REMOVE] Not found for Remove:", id);
                return response.notFound(res, 'Not found for Remove');
            }

            console.log("✅ [REMOVE TICKET] Deleted:", result);
            response.success(res, result, "Success to Remove Ticket");
        } catch (error) {
            console.error("❌ [REMOVE TICKET] Failed:", error);
            response.error(res, error, 'Failed to Remove Ticket');
        }
    },

    async findAllByEvent(req: IReqUser, res: Response) {
        const { eventId } = req.params;
        console.log("🎫 [FIND TICKETS BY EVENT] Event ID:", eventId);

        try {
            if (!isValidObjectId(eventId)) {
                console.warn("⚠️ [FIND TICKETS BY EVENT] Invalid Event ID");
                return response.error(res, null, "Ticket Not Found");
            }

            const result = await TicketModel.find({ events: eventId }).exec();

            console.log("✅ [FIND TICKETS BY EVENT] Found:", result.length, "tickets");
            response.success(res, result, "Success Find All Ticket by an Event");
        } catch (error) {
            console.error("❌ [FIND TICKETS BY EVENT] Failed:", error);
            response.error(res, error, 'Failed to Find Event by Ticket');
        }
    },
};
