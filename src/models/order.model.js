import { Schema, model, Types } from "mongoose";

const OrderSchema = new Schema({
    clientId: {
        type: Types.ObjectId,
        ref: "Client",
        required: true
    },
    courseId: {
        type: Types.ObjectId,
        ref: "Course",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true,
    versionKey: false
});

const Order = model("Order", OrderSchema);
export default Order;