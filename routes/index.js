const router = require("express").Router();
const auth = require("./api/auth");
const login = require("./api/login");
const register = require("./api/register");
const users = require("./api/users");
const orders = require("./api/orders");
const assets = require("./api/assets");
const trades = require("./api/trades");
const holdings = require("./api/holdings");

router.use("/api/auth", auth);
router.use("/api/login", login);
router.use("/api/register", register);
router.use("/api/users", users);
router.use("/api/orders", orders);
router.use("/api/assets", assets);
router.use("/api/trades", trades);
router.use("/api/holdings", holdings);

module.exports = router;
