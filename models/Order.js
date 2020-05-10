const mongoose = require("mongoose");
const { ORDER_STATUS, ORDER_DURATION } = require("../constants");
const orderSchema = new mongoose.Schema(
    {
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: ORDER_STATUS.OPEN,
        },
        // asset_id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        // },
        asset_symbol: {
            type: String,
            required: true,
        },
        order_type: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        filled_quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        limit_price: {
            type: Number,
        },
        stop_price: {
            type: Number,
        },
        // price: {
        //     type: Number,
        //     required: true
        // },
        duration: {
            type: String,
            required: true,
            default: ORDER_DURATION.DAY,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
