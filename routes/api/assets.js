const express = require("express");
const router = express.Router();
const Asset = require("../../models/Asset");
const auth = require("../../middleware/auth");
// const { check, validationResult } = require("express-validator/check");

// @route   GET api/assets
// @desc    Get a list of assets
// @access  Public
router.get("/", async (req, res) => {
    try {
        const assets = await Asset.find({});
        return res.json(assets);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// @route   GET api/assets/:id
// @desc    Get an asset By Id
// @access  Public

router.get("/:id", async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) return res.status(404).json({ msg: "Asset not found" });

        res.json(asset);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Asset not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   GET api/assets/:symbol
// @desc    Get an asset By Symbol
// @access  Public

router.get("/:symbol", async (req, res) => {
    try {
        const asset = await Asset.find({
            symbol: req.params.id.toUpperCase()
        });

        if (!asset) return res.status(404).json({ msg: "Asset not found" });

        res.json(asset);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/assets/:id
// @desc    Delete an asset
// @access  Private

router.delete("/:id", auth, async (req, res) => {
    try {
        await Asset.findOneAndRemove({ _id: req.params.id });

        res.json({ msg: "Asset Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/assets/:symbol
// @desc    Delete an asset
// @access  Private

router.delete("/:symbol", auth, async (req, res) => {
    try {
        await Asset.findOneAndRemove({ symbol: req.params.symbol });

        res.json({ msg: "Asset Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;
