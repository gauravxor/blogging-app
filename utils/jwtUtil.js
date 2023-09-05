const jwt = require("jsonwebtoken");

/**
 *  The Access and Refresh Tokens have the following payloads
 * 	1. User's Id
 *  2. User's Email ID
 * 	3. Expiry Time
**/

/* Function to generate Access Token */
function generateAccessToken(userId, userEmail) {
    const accessPayload = {
        userId: userId,
        userEmail: userEmail,
    };
    const accessToken = jwt.sign(
        accessPayload,
        process.env.JWT_ACCESS_SECRET,	/* JWT Access Secret */
        { expiresIn: process.env.JWT_ACCESS_EXPIRY }	/* Access token expiry Time */
    );
    return accessToken;
}

/* Function to generate Refresh Token */
function generateRefreshToken(userId, userEmail) {
    const refreshPayload = {
        userId: userId,
        userEmail: userEmail,
    };
    const refreshToken = jwt.sign(
        refreshPayload,
        process.env.JWT_REFRESH_SECRET,  /* JWT Refresh Secret */
        { expiresIn: process.env.JWT_REFRESH_EXPIRY } /* Refresh token expiry Time */
    );
    return refreshToken;
}

/* Function to validate Access Token */
function validateAccessToken(accessToken) {
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        return decoded;
    }
    catch (err) {
        return null;
    }
}

/* Function to validate Refresh Token */
function validateRefreshToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        return decoded;
    }
    catch (err) {
        return null;
    }
}

/* Function to validate both Access and Refresh Token */
async function validateTokens(req, res, next) {
    if (JSON.stringify(req.cookies) === '{}') {
        return res.status(401).send({
            message: "Unauthorized access"
        });
    }

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    /** Check if access token is valid */
    const accessPayload = validateAccessToken(accessToken);
    if (accessPayload) {
        req.userId = accessPayload.userId;
        req.userEmail = accessPayload.userEmail;
        return next();
    }
    console.log("Invalid access token, checking for refresh token");

    /** Check if refresh token is valid */
    const refreshPayload = validateRefreshToken(refreshToken);
    if (refreshPayload) {
        req.userId = refreshPayload.userId;
        req.userEmail = refreshPayload.userEmail;

        const newAccessToken = generateAccessToken(refreshPayload.userId, refreshPayload.userEmail);
        const newRefreshToken = generateRefreshToken(refreshPayload.userId, refreshPayload.userEmail);
        /** Send out brand new tokens */
        res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: "strict", secure: false });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: "strict", secure: false });

        return next();
    }
    console.log("Invalid token! Please login again");

    /** Clear out any expired/leftout tokens */
    res.clearCookie('accessToken', { httpOnly: true, sameSite: "strict", secure: false })
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: "strict", secure: false })

    return res.status(401).send({
        message: "You must be logged in peform this action"
    });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    validateTokens
}