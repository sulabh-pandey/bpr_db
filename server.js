const express = require("express");
const { Client } = require('pg');
const cors = require("cors");
require('dotenv').config();
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname + "/public/build")));
app.use(express.json());
app.use(cors());

const client = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: false
});

client.connect();

//Check Server is on
app.get('/bpr_db', (req, res) => {
    return res.json("From Backend side");
});

//Process Data query
app.get('/bpr_db/:indType', (req, res) => {
    const tbl_name = req.params.indType;
    const sql = `SELECT * FROM ${tbl_name}`;
    client.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
})

//Login Check query
app.post('/bpr_db/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE username = $1 AND password = $2";
    client.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.rows.length > 0) {
            return res.json({ message: true });
        } else {
            return res.json({ message: false });
        } 
    });
})

let port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});
