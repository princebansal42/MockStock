const express = require("express");
const router = express.Router();
const Asset = require("../../models/Asset");
const Holding = require("../../models/Order");
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

module.exports = router;
