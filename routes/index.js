const router = require("express").Router();
const auth = require("./api/auth");
const login = require("./api/login");
const register = require("./api/register");
// const orders = require("./api/orders");
router.use("/api/auth", auth);
router.use("/api/login", login);
router.use("/api/register", register);
// router.use("/api/users", users);

// router.use("/api/orders", orders);

module.exports = router;
