const colors = require('colors');

const logout = async (req, res) => {
    console.log("[LOGOUT] User logged out".green);
    /** Clearing out cookies, in the user's end */
    res
        .clearCookie('accessToken', { httpOnly: true, sameSite: "strict", secure: false })
        .clearCookie('refreshToken', { httpOnly: true, sameSite: "strict", secure: false })
        .status(200).send({
            message: "Logged out successfully!",
        });
}

module.exports = logout;