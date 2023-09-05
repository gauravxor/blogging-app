const express = require('express');
const authRoutes = express.Router();

const jwtUtil = require("../utils/jwtUtil");

const login = require('../controllers/auth/login');
const signup = require('../controllers/auth/signup');
const logout = require('../controllers/auth/logout');


/** Handle all the signup request  */
authRoutes.post('/signup', signup);

/** Handle all the login request  */
authRoutes.post('/login', login);

/** Handle all the logout request  */
/** Using a middleware to validate the incoming logout request */
authRoutes.post('/logout', jwtUtil.validateTokens, logout);

module.exports = authRoutes;