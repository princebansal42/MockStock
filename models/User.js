const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true,
            default: "USD"
        },
        cash: {
            type: Number,
            required: true,
            default: 100000
        }
    },
    { timestamps }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
