import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utills/intercace";
import response from "../utills/response";
import TicketModel, { TypeTicket, ticketDao } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";
import { object } from "yup";


export default {
    async create(req: IReqUser, res: Response) {
        try {
            await ticketDao.validate(req.body);
            const result = await TicketModel.create(req.body);

            response.success(res, result, 'Success to Create Ticket')
        } catch (error) {
            response.error(res, error, 'Failed to Create Ticket')
        }
    },
    async findAll(req: IReqUser, res: Response) {
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
                    $text: {
                        $search: search,
                    },
                });
            }

            const result = await TicketModel.find(query)
                .populate("events")
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await TicketModel.countDocuments(query);

            response.pagination(res, result, {
                total: count,
                current: page,
                totalPages: Math.ceil(count / limit)
            }, "Succes find All Ticket");

        } catch (error) {
            response.error(res, error, 'Failed to Find All Ticket')
        }
    },

    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await TicketModel.findById(id);
            if (!result) {
                return response.notFound(res, 'Failed find one a Ticket')
            }

            response.success(res, result, "success find Ticket");
        } catch (error) {
            response.error(res, error, 'Failed to Find One Ticket')
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await TicketModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            response.success(res, result, "success to Update Ticket");
        } catch (error) {
            response.error(res, error, 'Failed to Update Ticket')
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await TicketModel.findByIdAndDelete(id, {
                new: true,
            });

            response.success(res, result, "success to Remove Ticket");
        } catch (error) {
            response.error(res, error, 'Failed to Remove Ticket')
        }
    },
    async findAllByEvent(req: IReqUser, res: Response) {
        try {
            const { eventId } = req.params;

            if (!isValidObjectId(eventId)) {
                return response.error(res, null, "Ticket Not Found");
            }

            const result = await TicketModel.find({ events: eventId }).exec();
            response.success(res, result, "Success Find All Ticket by an Event");

        } catch (error) {
            response.error(res, error, 'Failed to Find Event by Ticket')
        }
    },
}