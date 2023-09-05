const dbUtils = require("../../utils/dbUtils");
const jwtUtil = require("../../utils/jwtUtil");

const signup = async (req, res) => {
    const emailId = req.body.email;
    const password = req.body.password;

    const db = dbUtils.getDBConnection();

    /** Checking if user already exists in the database */
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [emailId], (error, row) => {
        /** If there is any error during checking process */
        if (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
        /** If we find something in the database */
        if (row) {
            return res.status(409).json({
                message: "User already exists :("
            });
        }

        /** If new user, insert the data into database */
        const insertQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;
        db.run(insertQuery, [emailId, password], (error) => {
            /** If any error is encountered while inserting the data */
            if (error) {
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message
                });
            }
            /** If data is inserted successfully, generate access tokens */
            const accessToken = jwtUtil.generateAccessToken(this.lastId, emailId);
            const refreshToken = jwtUtil.generateRefreshToken(this.lastId, emailId);

            /** Upon generation of access tokens, send out to the user */
            res
                .cookie('accessToken', accessToken, { httpOnly: true, sameSite: "strict", secure: false })
                .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "strict", secure: false })
            /** Send appropriate response */
            return res.status(200).send({
                message: "Signed up successful!",
                data: row
            });
        });
    });
}

module.exports = signup;