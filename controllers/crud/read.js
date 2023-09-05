const path = require("path");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle read requests for blog posts */
const read = async (req, res) => {
    return res.status(200).json({
        message: "I will READING posts"
    });
};

module.exports = read;