const dbUtils = require("../../utils/dbUtils");
const jwtUtil = require("../../utils/jwtUtil");

const login = async (req, res) => {

    const emailId = req.body.email;
    const password = req.body.password;

    const db = dbUtils.getDBConnection();
    /** Checking if the email-id and password is there in database */
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(sql, [emailId, password], (error, row) => {
        /** If there is any error during the checking process */
        if (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
        /** If the data exisis, we generate access tokens and log the user in. */
        if (row) {

            /** Generating access tokens */
            const accessToken = jwtUtil.generateAccessToken(row.id, row.email);
            const refreshToken = jwtUtil.generateRefreshToken(row.id, row.email);
            /** Sending out the tokens to the user */
            res
                .cookie('accessToken', accessToken, { httpOnly: true, sameSite: "strict", secure: false })
                .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "strict", secure: false })
                .status(200)
            return res.status(200).send({
                message: "Logged in successfully!",
                data: row
            });
        }
        /** If the data is not found in the database */
        return res.status(401).json({
            message: "Invalid Credentials :("
        });
    });
}

module.exports = login;