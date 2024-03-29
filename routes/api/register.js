const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

// @route   POST api/register
// @desc    Register User
// @access  Public
router.post(
    "/",
    [
        check("name", "Name is Required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, currency } = req.body;
        console.log(`Name: ${name} Email: ${email} Password: ${password}`);
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exist" }] });
            }

            user = new User({
                name,
                email,
                password,
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get("jwtSecretKey"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    return res.json({ token });
                }
            );
            // See if user exists
            // if exists Send error
            // Get users gravatar
            // Encrypt Password
            // Return jsonwebtoken
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error");
        }
    }
);
module.exports = router;
