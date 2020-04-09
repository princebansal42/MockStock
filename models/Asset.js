const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
            set: s => s.toUpperCase()
        },
        exchange: {
            type: String,
            required: true,
            set: e => e.toUpperCase()
        },
        tradable: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    { timestamps }
);

const Asset = mongoose.model("asset", assetSchema);
module.exports = Asset;
