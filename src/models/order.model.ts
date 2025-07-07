import mongoose, { Schema } from "mongoose";
import * as Yup from "yup";
import { EVENT_MODEL_NAME } from "./event.model";
import { USER_MODEL_NAME } from "./user.model";
import { TICKET_MODEL_NAME } from "./ticket.model";
import { getId } from "../utills/id";
import payment, { TypeResponseMidtrans } from "../utills/payment";
import { create } from "ts-node";

export const ORDER_MODEL_NAME = "Order";
export const orderDao = Yup.object({
    createdBy: Yup.string().required(),
    events: Yup.string().required(),
    ticket: Yup.string().required(),
    quantity: Yup.number().required(),
});

export type TypeOrder = Yup.InferType<typeof orderDao>;

export enum ORDER_STATUS {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    CANCELLED = "cancelled",
}

export type TypeVoucher = {
    voucherId: string;
    isPrint: boolean;
};

export interface Order extends Omit<TypeOrder, "createdBy" | "events" | "ticket"> {
    total: number;
    status: string;
    payment?: TypeResponseMidtrans;
    createdBy: Schema.Types.ObjectId;
    events: Schema.Types.ObjectId;
    orderId: string;
    ticket: Schema.Types.ObjectId;
    quantity: number;
    voucher?: TypeVoucher[];
}

const OrderSchema = new Schema<Order>({
    orderId: {
        type: Schema.Types.String,
        default: getId(7),
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: USER_MODEL_NAME,
    },
    events: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: EVENT_MODEL_NAME,
    },
    total: {
        type: Schema.Types.Number,
        required: true,
    },
    payment: {
        type: {
            token: {
                type: Schema.Types.String,
                required: true
            },
            redirect_url: {
                type: Schema.Types.String,
                required: true
            }
        },
        status: {
            type: Schema.Types.String,
            enum: [ORDER_STATUS.PENDING, ORDER_STATUS.SUCCESS, ORDER_STATUS.FAILED, ORDER_STATUS.CANCELLED],
            default: ORDER_STATUS.PENDING,
        }
    },

    ticket: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: TICKET_MODEL_NAME
    },
    quantity: {
        type: Schema.Types.Number,
        required: true,
    },
    voucher: {
        type: [{
            voucherId: {
                type: Schema.Types.String,
                required: true
            },
            isPrint: {
                type: Schema.Types.Boolean,
                default: false
            }
        }],
        default: []
    }
}, {
    timestamps: true
}).index({ orderId: "text" });


OrderSchema.pre("save", async function (next) {
    const order = this;
    order.orderId = getId(7); // Generate a new order ID if not provided
    order.payment = await payment.createLink({
        transaction_detail: {
            gross_amount: order.total,
            order_id: order.orderId
        }
    });
})

const OrderModel = mongoose.model(ORDER_MODEL_NAME, OrderSchema);

export default OrderModel;