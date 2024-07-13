const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const dbPath = path.resolve(__dirname, 'data', 'treasures.db');
const db = new sqlite3.Database(dbPath);

const fs = require('fs');
const dataDir = path.resolve(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS treasures (id INTEGER PRIMARY KEY, title TEXT, description TEXT, lat REAL, lng REAL)");
    db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, treasure_id INTEGER, comment TEXT)");
});

app.post('/api/add-treasure', (req, res) => {
    const { title, description, lat, lng } = req.body;
    db.run("INSERT INTO treasures (title, description, lat, lng) VALUES (?, ?, ?, ?)", [title, description, lat, lng], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.sendStatus(200);
    });
});

app.get('/api/treasures', (req, res) => {
    db.all("SELECT * FROM treasures", [], (err, rows) => {
        if (err) {
            return console.log(err.message);
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
