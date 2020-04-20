const express = require("express");
const router = express.Router();
const Trade = require("../../models/Trade");
const auth = require("../../middleware/auth");
// const { check, validationResult } = require("express-validator/check");

// @route   GET api/trades
// @desc    Get a list of trades
// @access  Public
router.get("/", auth, async (req, res) => {
    try {
        const trades = await Trade.find({});
        return res.json(trades);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// @route   GET api/trades/:id
// @desc    Get an trade By Id
// @access  Public

router.get("/id/:id", auth, async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.id);

        if (!trade) return res.status(404).json({ msg: "Trade not found" });
        // if (
        //     trade.buyer_id.toString() === req.user.id ||
        //     trade.seller_id.toString() === req.user.id
        // )
        return res.json(trade);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Asset not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   GET api/trades/:symbol
// @desc    Get an trades By Symbol
// @access  Public

router.get("/symbol/:symbol", async (req, res) => {
    try {
        const trades = await Trade.find({
            asset_symbol: req.params.id.toUpperCase(),
        });

        // if (!asset) return res.status(404).json({ msg: "Asset not found" });

        res.json(trades);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
