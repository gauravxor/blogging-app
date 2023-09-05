const path = require("path");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle requests to delete blog posts */
const remove = async (req, res) => {
    return res.status(200).json({
        message: "I will be DELETING posts"
    });
};

module.exports = remove;