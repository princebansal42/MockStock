const Asset = require("../models/Asset");
const pusher = require("../config/pusherConfig");
const getAssets = async () => {
    try {
        const assets = await Asset.find({});
        pusher.trigger("match-engine", "get assets", assets);
    } catch (err) {
        console.log(err);
    }
};
module.exports = getAssets;
