const mongoose = require("mongoose");
const { ORDER_STATUS, ORDER_DURATION } = require("../constants");
const holdingSchema = new mongoose.Schema(
    {
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        asset_symbol: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        avg_price: {
            type: Number,
            required: true,
        },
        locked_qty: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

const Holding = mongoose.model("holding", orderSchema);
module.exports = Holding;
