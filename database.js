const sqlite3 = require('sqlite3').verbose();

const dbPath = './users.db';
const db = new sqlite3.Database(dbPath);

// Create users table if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        name TEXT
    )`);
});

// Function to insert a new user
function insertUser(username, password, name, callback) {
    const sql = 'INSERT INTO users (username, password, name) VALUES (?, ?, ?)';
    db.run(sql, [username, password, name], function(err) {
        if (err) {
            console.error('Error inserting user into database:', err);
            return callback(err);
        }
        callback(null, this.lastID);
    });
}

// Function to find a user by username and password
function findUser(username, password, callback) {
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(sql, [username, password], function(err, row) {
        if (err) {
            console.error('Error querying database:', err);
            return callback(err);
        }
        callback(null, row);
    });
}

module.exports = {
    insertUser,
    findUser
};
