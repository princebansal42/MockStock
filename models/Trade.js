const mongoose = require("mongoose");
const { ORDER_STATUS, ORDER_DURATION } = require("../constants");
const tradeSchema = new mongoose.Schema(
    {
        traded_price: {
            type: Number,
            required: true,
        },
        buyer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        buy_order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        sell_order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        // asset_id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        // },
        asset_symbol: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        bid_price: {
            type: Number,
        },
        ask_price: {
            type: Number,
        },
    },
    { timestamps }
);

const Trade = mongoose.model("trade", tradeSchema);
module.exports = Trade;
