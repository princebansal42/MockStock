const express = require("express");
const router = express.Router();
const Asset = require("../../models/Asset");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Holding = require("../../models/Holding");
const auth = require("../../middleware/auth");

const pusher = require("../../config/pusherConfig");

const { ORDER_STATUS, ORDER_TYPE, ACTION } = require("../../constants");
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
router.post("/", auth, async (req, res) => {
    try {
        const {
            asset_symbol,
            action,
            quantity,
            limit_price,
            stop_price,
        } = req.body;
        let { order_type } = req.body;
        order_type = order_type.toUpperCase();
        let order = {
            client_id: req.user.id,
            asset_symbol,
            order_type: ORDER_TYPE[order_type],
            action: Action[action.toUpperCase()],
            quantity,
        };

        let margin = 1.1;

        // if (order_type === ORDER_TYPE.STOP) {
        //     order.stop_price = stop_price;
        // }
        // if (order_type === ORDER_TYPE.STOP_LIMIT) {
        //     order.stop_price = stop_price;
        //     order.limit_price = limit_price;
        // }
        const asset = await Asset.findOne({ symbol: asset_symbol });
        let limit = asset.ltp * margin;
        if (order_type === ORDER_TYPE.LIMIT) {
            order.limit_price = limit_price;

            if (limit_price > limit || limit_price < -1 * limit) {
                return res
                    .json(401)
                    .json({ msg: "Given Limit Price not Allowed" });
            }
        }

        order = new Order(order);

        let order_cost = order_type === ORDER_TYPE.LIMIT ? limit_price : limit;
        order_cost *= quantity;
        let query;
        if (action === ACTION.BUY) {
            const user = await User.findById(req.user.id);

            if (user.balance < order_cost) {
                order.status = ORDER_STATUS.REJECTED;
                order = await order.save();
                return res
                    .status(401)
                    .json({ msg: "Not have sufficient balance" });
            }
            order.order_cost = order_cost;
            query = User.findByIdAndUpdate(req.user.id, {
                $inc: {
                    balance: -1 * order_cost,
                },
            });
        }
        if (action === ACTION.SELL) {
            const holding = await Holding.findOne({ client_id: req.user.id });
            // let avail_holdings = holding.quantity - holding.locked_qty;
            if (holding.quantity < quantity) {
                order.status = ORDER_STATUS.REJECTED;
                order = await order.save();
                return res
                    .status(401)
                    .json({ msg: "Not have sufficient Stocks" });
            }
            query = Holding.findOneAndUpdate(
                { client_id: req.user.id },
                {
                    $inc: {
                        quantity: -1 * quantity,
                    },
                }
            );
        }

        await query.exec();
        order = await order.save();
        pusher.trigger("match-engine", "add order", order);
        return res.json(order);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// @route   GET api/orders/:id
// @desc    Get an order by id
// @access  Private

router.get("/id/:id", auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            client_id: req.user.id,
        });

        if (!order) return res.status(404).json({ msg: "Order not found" });

        return res.json(order);
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

router.get("/symbol/:symbol", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            client_id: req.user.id,
            asset_symbol: req.params.symbol.toUpperCase(),
        });

        return res.json(orders);
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

        return res.json({ msg: "Order Deleted" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

router.put("/:id/cancel", auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            client_id: req.user.id,
        });

        if (!order) return res.status(404).json({ msg: "Order not found" });
        let msg = "";
        if (
            order.status === ORDER_STATUS.OPEN ||
            order.status === ORDER_STATUS.PARTIAL
        ) {
            // Call the Matching engine using pusher from here
            msg = "Request From Cancellation Accepted";
            let orderDetails = {
                id: req.params.id,
                asset_symbol: order.asset_symbol,
                action: order.action,
            };

            pusher.trigger("match-engine", "cancel order", orderDetails);
        } else msg = "Order Cancellation Request Rejected";
        return res.json({ msg });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Order not found" });
        }
        res.status(500).send("Server Error");
    }
});

router.put("/:id/edit", auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            client_id: req.user.id,
        });

        if (!order) return res.status(404).json({ msg: "Order not found" });
        let msg = "";
        if (order.status === ORDER_STATUS.OPEN) {
            // Call the Matching engine using pusher from here
            msg = "Request From Editing Order Accepted";

            pusher.trigger("match-engine", "cancel order", neworderDetails);
        } else msg = "Edit Order Request Rejected";
        return res.json({ msg });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Order not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
