const express = require('express');
const homeRoute = express.Router();

/** Home route */
homeRoute.get('/', (req, res) => {
	return res.status(200).json({
		humble_request : "Hey, Hire Me Pleaaaaseeee!!! :)"
	});
});

module.exports = homeRoute;