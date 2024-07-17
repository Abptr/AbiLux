const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// SQLite database setup
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

// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the registration form HTML
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Route to handle registration form submission
app.post('/register', (req, res) => {
    const { username, password, name } = req.body;

    // Insert new user into database
    db.run('INSERT INTO users (username, password, name) VALUES (?, ?, ?)', [username, password, name], (err) => {
        if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).json({ success: false, message: 'Failed to register user. Please try again later.' });
        }

        res.json({ success: true, message: 'User registered successfully.' });
    });
});

// Route to serve the login form HTML
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if user exists in database
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ success: false, message: 'Failed to authenticate user. Please try again later.' });
        }

        if (!row) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        res.json({ success: true, message: 'Login successful.', user: row });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
