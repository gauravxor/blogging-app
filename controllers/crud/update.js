const path = require("path");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle requests to update posts */
const update = async (req, res) => {
    return res.status(200).json({
        message: "I will UPDATE posts"
    });
};

module.exports = update;