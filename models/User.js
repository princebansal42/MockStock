const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            default: "USD",
        },
        balance: {
            type: Number,
            required: true,
            default: 9999999,
        },
        // locked_balance: {
        //     type: Number,
        //     required: true,
        //     deafult: 0,
        // },
    },
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
