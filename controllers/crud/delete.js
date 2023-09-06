const colors = require("colors");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle requests to delete blog posts */
const remove = async (req, res) => {
    const blogId = req.params.id;

    /** Checking if input parameter is valid */
    if (blogId === "") {
        console.log("[DELETE] Invalid Input Provided".red);
        return res.status(400).json({
            message: "Invalid Blog-ID "
        });
    }

    /** Checking if the blog post exists */
    const db = dbUtils.getDBConnection();
    const blogExistsQuery = `
        SELECT * FROM blogs
        WHERE id = ?`;

    db.get(blogExistsQuery, blogId, (error, blog) => {
        /** If any error is encountered while performing the query */
        if (error) {
            console.log("[DELETE] Failed to search the blog post".red);
            console.log(error.message);
            return res.status(500).json({
                message: "Internal server error"
            });
        }

        /** If the blog post was not found in the database */
        if (!blog) {
            console.log("[DELETE] Blog post not found".red);
            return res.status(404).json({
                message: "Blog post not found"
            });
        }

        /** Checking if the blog post is written by the current user */
        if (blog.creator_id !== req.userId) {
            console.log("[DELETE] Unauthorized User".red);
            return res.status(403).json({
                message: "Unauthorized access"
            });
        }

        /** Deleting the blog post */
        const blogDeleteQuery = `
            DELETE FROM blogs
            WHERE id = ?`;

        db.run(blogDeleteQuery, blogId, (error) => {
            if (error) {
                console.log("[DELETE] Failed to delete the blog post".red);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            console.log(`Blog post ${blogId} was deleted by user ${req.userId}`.green);
            return res.status(200).json({
                message: "Blog post DELETED"
            });
        });
    });
};

module.exports = remove;