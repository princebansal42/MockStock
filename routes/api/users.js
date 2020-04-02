const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route   GET api/users
// @desc    Get Authenticated user's data
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// @route   PATCH api/users
// @desc    Update user's information
// @access  Private

router.patch("/", auth, async (req, res) => {
    try {
        const updates = { ...req.body };

        const user = await User.findByIdAndUpdate(req.user.id, updates);

        // const updates = { ...req.body };

        // const user = await User.findById(req.user.id);
        // if (!user) return res.status(400).json({ msg: "There is no user." });
        // return res.json(user);
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/users
// @desc    Delete user
// @access  Private

router.delete("/", auth, async (req, res) => {
    try {
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: "User Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;
