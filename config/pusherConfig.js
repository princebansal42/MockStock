const Pusher = require("pusher");
const config = require("config");
const pusher = new Pusher({
    appId: config.get("Pusher_appId"),
    key: config.get("Pusher_key"),
    secret: config.get("Pusher_secret"),
    cluster: config.get("Pusher_cluster"),
});

module.exports = pusher;
