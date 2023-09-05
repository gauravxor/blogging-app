const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");
const databasePath = __dirname + "/../db.sqlite3";

/** To create the database file if it doesn't exist */
const createDatabaseFileIfNeeded = () => {
    if (!fs.existsSync(databasePath)) {
        console.log("Database file not found. Creating a new one...");
        try {
            fs.writeFileSync(databasePath, "");
            console.log("Database file created.");
        }
        catch (err) {
            console.error("Error creating the database file:", err.message);
        }
    }
    else {
        console.log("Database file found.");
    }
}


/** To get the database connection object */
const getDBConnection = () => {
    createDatabaseFileIfNeeded();
    const db = new sqlite3.Database(databasePath, (error) => {
        if (error) {
            console.log("Error connecting to the database.");
            return console.error(error.message);
        }
        console.log("Connected to the database.");
    });
    return db;
}


/** To initialize the database with the necessary tables. Runs once, during server startup */
const initDB = () => {
    const db = getDBConnection();
    /** Query to create necessary tables */
    const initQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS blogs (
            creater_id INTEGER NOT NULL REFERENCES users(id),
            title VARCHAR(50) NOT NULL,
            content VARCHAR(5000),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;

    /** Executing the query to create the tables */
    db.exec(initQuery, (error) => {
        if (error) {
            console.log(error.message);
        }
        else {
            console.log("Database initialized!");
        }
    });
}

module.exports = {
    getDBConnection,
    initDB
}