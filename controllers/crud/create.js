const path = require("path");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle all the requests to create new blog posts */
const create = async (req, res) => {
    return res.status(200).json({
        message: "I will be CREATING posts"
    });
};

module.exports = create;