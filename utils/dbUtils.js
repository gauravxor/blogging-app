const colors = require("colors");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");
const databasePath = __dirname + "/../db.sqlite3";

/** To create the database file if it doesn't exist */
const createDatabaseFileIfNeeded = () => {
    if (!fs.existsSync(databasePath)) {
        console.log("[DB-UTIL] Creating new DB file".yellow);
        try {
            fs.writeFileSync(databasePath, "");
            console.log("[DB-UTIL] Database created".yellow);
        }
        catch (err) {
            console.log("[DB-UTIL] Error creating Database ".red);
        }
    }
    else {
        console.log("[DB-UTIL] Database Found".yellow);
    }
}

/** To get the database connection object */
const getDBConnection = () => {
    createDatabaseFileIfNeeded();
    const db = new sqlite3.Database(databasePath, (error) => {
        if (error) {
            console.log("[DB-UTIL] Error connecting to Database".red);
            return console.error(error.message);
        }
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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            creator_id INTEGER NOT NULL REFERENCES users(id),
            title VARCHAR(50) NOT NULL,
            content VARCHAR(5000) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;

    /** Executing the query to create the tables */
    db.exec(initQuery, (error) => {
        if (error) {
            console.log("[DB-UTIL] Error initializing Database".red);
        }
        else {
            console.log("[DB-UTIL] Initialized the Database".yellow);
        }
    });
}

module.exports = {
    getDBConnection,
    initDB
}