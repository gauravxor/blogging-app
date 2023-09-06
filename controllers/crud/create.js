const colors = require("colors");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle all the requests to create new blog posts */
const create = async (req, res) => {
    const userId = req.userId;  // we get this from the validateTokens middleware
    const { title, content } = req.body;

    /** Validating the input */
    if (title === "" || content === "") {
        console.log("[CREATE] Invaild Input Provided".red)
        return res.status(400).json({
            message: "Title/Content cannot be empty"
        });
    }

    /** Creating a new blog post */
    const db = dbUtils.getDBConnection();
    const blogCreateQuery = `
        INSERT INTO blogs (creator_id, title, content)
        VALUES (?, ?, ?)`;

    const blogCreateQueryValues = [userId, title, content];
    db.run(blogCreateQuery, blogCreateQueryValues, (error) => {
        if (error) {
            console.log("[CREATE] Error while creating blog post".red);
            console.log(error.message);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
        console.log(`[CREATE] Blog post created`.yellow);
        return res.status(201).json({
            message: "Blog post created!"
        });
    });
};

module.exports = create;