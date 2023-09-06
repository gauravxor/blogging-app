const colors = require("colors");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle requests to update posts */
const update = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.userId;  // we get this from the validateTokens middleware
    const { title, content } = req.body;

    /** Validating the input */
    if (title === "" || content === "") {
        console.log("[UPDATE] Invalid Input".red);
        return res.status(400).send({
            message: "Title/Content cannot be empty"
        });
    }

    const db = dbUtils.getDBConnection();

    /** Checking if the blog post exists */
    const blogExistsQuery = `
        SELECT * FROM blogs
        WHERE id = ?`;
    db.get(blogExistsQuery, blogId, (error, blog) => {
        if (error) {
            console.log("[UPDATE] Error searching the blog post".red);
            return res.status(500).send({
                message: "Internal Server Error"
            });
        }
        /** If the blog post doesnot exists */
        if (!blog) {
            console.log("[UPDATE] Blog post not found".yellow);
            return res.status(404).json({
                message: "Blog post not found"
            });
        }
        /** Checking if the current user is the creator of the blog post */
        if (blog.creator_id !== userId) {
            console.log("[UPDATE] Unauthorized User".red);
            return res.status(401).json({
                message: "You are not authorized to update this blog post"
            });
        }

        /** Updating the blog post */
        const updateQuery = `
        UPDATE blogs
        SET title = ?, content = ?
        WHERE id = ?`;

        const updateData = [title, content, blogId];
        db.run(updateQuery, updateData, (error) => {
            console.log("[UPDATE] Blog post updated".green);
            if (error) {
                console.log(error.message);
                return res.status(500).send({
                    message: "Internal Server Error"
                });
            }
            return res.status(200).send({
                message: "Blog post UPDATED"
            });
        });
    });
};

module.exports = update;