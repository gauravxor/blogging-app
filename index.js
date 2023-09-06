const express = require("express");
const cookieParser 	= require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');

const dbUtils = require("./utils/dbUtils");

const homeRoute = require("./routes/homeRoute");
const authRoute = require("./routes/authRoute");
const crudRoute = require("./routes/crudRoute");


const app = express();
dotenv.config();

/** Initializing the database */
dbUtils.initDB();

/** Setting up the body parser to the incoming json data could be processed */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Setting up the cookie parser to be able to process incoming http cookies */
app.use(cookieParser());

/** Setting up CORS */
app.use(cors({
    credentials: true,   // to allow http only cookies to be sent to/from the server
    allowedHeaders: ['content-type', 'Authorization', 'Content-Type'],  // to allow the specific headers to be sent to/from the server
    origin: ['http://localhost:4000']   // to allow requests from the client (in our case, the localhost)
}));


app.use('/', homeRoute);
app.use('/auth/', authRoute);
app.use('/blog/', crudRoute);

/** Starting the server */
app.listen(process.env.PORT, () => {
    console.log(`[INDEX] Server started on port ${process.env.PORT}`.yellow);
});