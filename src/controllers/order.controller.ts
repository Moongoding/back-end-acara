import axios from "axios";
import { Response } from "express";
import { IReqUser } from "../utills/intercace";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "../utills/env";
import { Payment, TypeResponseMidtrans } from "../utills/payment";
import response from "../utills/response";
import OrderModel, { orderDao, TypeOrder } from "../models/order.model";
import TicketModel from "../models/ticket.model";
import { object } from "yup";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const payload = {
                ...req.body,
                createdBy: userId,
            } as TypeOrder;

            await orderDao.validate(payload);
            const ticket = await TicketModel.findById(payload.ticket);
            if (!ticket) {
                return response.error(res, "Ticket not found", "Failed to create an Order");
            }
            if (ticket.quantity < payload.quantity) {
                return response.error(res, "Ticket quantity is not enough", "Failed to create an Order");
            }

            const total: number = +ticket.price * +payload.quantity;

            Object.assign(payload, {
                ...payload,
                total: total,
            });

            const result = await OrderModel.create(payload);
            if (!result) {
                return response.error(res, "Failed to create an Order", "Failed to create an Order");
            }
            response.success(res, result, "Order created successfully");


        } catch (error) {
            response.error(res, error, "Failed to create an Order");
        }
    },

    async FindAll(req: IReqUser, res: Response): Promise<TypeResponseMidtrans[]> {
        const result = await axios.get<TypeResponseMidtrans[]>(`${MIDTRANS_TRANSACTION_URL}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
            },
        });
        if (result.status !== 200) {
            throw new Error("Failed to fetch payments");
        }
        return result.data;
    },

    async findOne(orderId: string): Promise<TypeResponseMidtrans> {
        const result = await axios.get<TypeResponseMidtrans>(`${MIDTRANS_TRANSACTION_URL}/${orderId}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
            },
        });
        if (result.status !== 200) {
            throw new Error("Failed to fetch payment");
        }
        return result.data;
    },

    async findAllByMember(memberId: string): Promise<TypeResponseMidtrans[]> {
        const result = await axios.get<TypeResponseMidtrans[]>(`${MIDTRANS_TRANSACTION_URL}/member/${memberId}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
            },
        });
        if (result.status !== 200) {
            throw new Error("Failed to fetch payments for member");
        }
        return result.data;
    },

    async success(orderId: string): Promise<TypeResponseMidtrans> {
        const result = await axios.post<TypeResponseMidtrans>(`${MIDTRANS_TRANSACTION_URL}/success/${orderId}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
            },
        });
        if (result.status !== 200) {
            throw new Error("Failed to mark payment as successful");
        }
        return result.data;
    },

    async pending(orderId: string): Promise<TypeResponseMidtrans> {
        const result = await axios.post<TypeResponseMidtrans>(`${MIDTRANS_TRANSACTION_URL}/pending/${orderId}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
            },
        });
        if (result.status !== 200) {
            throw new Error("Failed to mark payment as pending");
        }
        return result.data;
    },

    async cancel(orderId: string): Promise<TypeResponseMidtrans> {
        const result = await axios.post<TypeResponseMidtrans>(`${MIDTRANS_TRANSACTION_URL}/cancel/${orderId}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
            },
        });
        if (result.status !== 200) {
            throw new Error("Failed to cancel payment");
        }
        return result.data;
    }
};