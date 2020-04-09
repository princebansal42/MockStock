const express = require("express");
const router = express.Router();
const Asset = require("../../models/Asset");
const Order = require("../../models/Order");
const auth = require("../../middleware/auth");
const {
    ORDER_STATUS,
    ORDER_TYPE,
    TRANSACTION_TYPE,
} = require("../../constants");
// const { check, validationResult } = require("express-validator/check");

// @route   GET api/orders
// @desc    Get a list of orders placed by a user
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find({ client_id: req.user.id });
        return res.json(orders);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// @route   POST api/orders
// @desc    Place an order
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const {
            asset_symbol,
            order_type,
            transaction_type,
            quantity,
            limit_price,
            stop_price,
        } = req.body;

        let order = {
            client_id: req.user.id,
            asset_symbol,
            order_type: ORDER_TYPE[order_type.toUpperCase()],
            transaction_type: TRANSACTION_TYPE[transaction_type.toUpperCase()],
            quantity,
        };
        if (order_type.toUpperCase() === ORDER_TYPE.LIMIT) {
            order.limit_price = limit_price;
        }
        if (order_type.toUpperCase() === ORDER_TYPE.STOP) {
            order.stop_price = stop_price;
        }
        if (order_type.toUpperCase() === ORDER_TYPE.STOP_LIMIT) {
            order.stop_price = stop_price;
            order.limit_price = limit_price;
        }

        order = await order.save();
        return res.json(order);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// @route   GET api/orders/:id
// @desc    Get an order by id
// @access  Private

router.get("/:id", auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            client_id: req.user.id,
        });

        if (!order) return res.status(404).json({ msg: "Order not found" });

        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Order not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   GET api/orders/:symbol
// @desc    Get orders by Symbol
// @access  Private

router.get("/:symbol", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            client_id: req.user.id,
            asset_symbol: req.params.id.toUpperCase(),
        });

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/orders/:id
// @desc    Delete an order
// @access  Private

router.delete("/:id", auth, async (req, res) => {
    try {
        await Order.findOneAndRemove({ _id: req.params.id });

        res.json({ msg: "Order Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
