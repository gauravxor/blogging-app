const express = require('express');
const crudRoutes = express.Router();

const jwtUtil = require("../utils/jwtUtil");
const create = require("../controllers/crud/create");
const read = require("../controllers/crud/read");
const update = require("../controllers/crud/update");
const remove = require("../controllers/crud/delete");  // delete is a reserved word :(

/** Handle requests for blog post creation */
crudRoutes.post('/create/', jwtUtil.validateTokens, create);

/** Handle requests to fetch blog posts */
crudRoutes.get('/read/', jwtUtil.validateTokens, read);

/** Handle requests to update blog posts */
crudRoutes.put('/update/', jwtUtil.validateTokens, update);

/** Handle requests to delete blog posts */
crudRoutes.delete('/delete/', jwtUtil.validateTokens, remove);

module.exports = crudRoutes;