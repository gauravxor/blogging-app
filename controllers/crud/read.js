const colors = require("colors");
const dbUtils = require("../../utils/dbUtils");

/** Controller to handle read requests for blog posts */
const read = async (req, res) => {
    const blogId = req.params.id;

    /** Checking if input parameter is valid */
    if (blogId === "") {
        console.log("[READ] Invalid Input".red);
        return res.status(400).json({
            message: "Invalid Blog-ID "
        });
    }

    const db = dbUtils.getDBConnection();
    const blogExistsQuery = `
        SELECT * FROM blogs
        WHERE id = ?`;

    db.get(blogExistsQuery, blogId, (error, blog) => {
        /** If any error is encountered while performing the query */
        if (error) {
            console.log("[READ] Error searching the blog post".red);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
        /** If the blog post was not found in the database */
        if (!blog) {
            console.log("[READ] Blog post not found".red);
            return res.status(404).json({
                message: "Blog post not found"
            });
        }
        console.log(`[READ] Blog post fetched`.green);
        blog.created_at = new Date(blog.created_at).toDateString();
        return res.status(200).json({
            blog: blog
        });
    });
};

module.exports = read;