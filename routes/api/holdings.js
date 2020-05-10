const express = require("express");
const router = express.Router();
const Asset = require("../../models/Asset");
const Holding = require("../../models/Holding");
const auth = require("../../middleware/auth");

// const { check, validationResult } = require("express-validator/check");

// @route   GET api/holdings
// @desc    Get all holdings of an user
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const holdings = await Holding.find({ client_id: req.user.id });
        return res.json(holdings);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// It is a Test Routes
// @route   POST api/holdings
// @desc    Add holdings
// @access  Private
router.post("/", auth, async (req, res) => {
    const { id } = req.user;
    const { asset_symbol, quantity, avg_price } = req.body;
    try {
        let holding = new Holding({
            client_id: id,
            asset_symbol,
            quantity,
            avg_price,
        });
        holding = await holding.save();
        return res.json(holding);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

module.exports = router;
