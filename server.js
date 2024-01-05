const express = require("express");
const fs = require("fs");
const { Client } = require('pg');
const cors = require("cors");
require('dotenv').config();
const app = express();
const path = require('path');

app.use(express.json());
app.use(cors());

//Database Connection
const client = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl:{ca:fs.readFileSync(process.env.DATABASE_SSL)}
});

console.log("Datatbase Connection Started");
client.connect()
.then(() => console.log('Database connected'))
.catch(err => console.error('Error connecting to database', err));
console.log("Datatbase Connection End");

//Check Server is on
app.get('/bpr_db', (req, res) => {
    return res.json("From Backend side");
});

//Serach from all table
app.post('/bpr_db/search', (req, res) => {
    const pid = req.body.linkC;
    // UNION ALL
    const a = `SELECT * FROM bus_capabilities_mgmt As a WHERE a."Process_ID" = '${pid}'`;
    const b = `SELECT * FROM hire_to_retire AS b WHERE b."Process_ID" = '${pid}'`; 
    const c = `SELECT * FROM it AS c WHERE c."Process_ID" = '${pid}'`;
    const d = `SELECT * FROM legal_and_global_trade AS d WHERE d."Process_ID" = '${pid}'`;
    const e = `SELECT * FROM marketing_to_sales AS e WHERE e."Process_ID" = '${pid}'`;
    const f = `SELECT * FROM idea_to_retire AS f WHERE f."Process_ID" = '${pid}'`;
    const g = `SELECT * FROM r2r AS g WHERE g."Process_ID" = '${pid}'`;
    const h = `SELECT * FROM customer_service_mgmt AS h WHERE h."Process_ID" = '${pid}'`;
    const i = `SELECT * FROM scm AS i WHERE i."Process_ID" = '${pid}'`;
    const j = `SELECT * FROM enterprise_asset_mgmt AS j WHERE j."Process_ID" = '${pid}'`;
    const k = `SELECT * FROM plan_to_perform AS k WHERE k."Process_ID" = '${pid}'`;
    const l = `SELECT * FROM service_delivery_mgmt AS l WHERE l."Process_ID" = '${pid}'`;
    const m = `SELECT * FROM info_security_grc AS m WHERE m."Process_ID" = '${pid}'`;

    const sql = `${a} UNION ALL ${b} UNION ALL ${c} UNION ALL ${d} UNION ALL ${e} UNION ALL ${f} UNION ALL ${g} UNION ALL ${h} UNION ALL ${i} UNION ALL ${j} UNION ALL ${k} UNION ALL ${l} UNION ALL ${m}`;

    console.log(sql);

    client.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if(data.rows.length > 0){
            return res.json(data);
        }else{
            return res.json({ message: "Data Not Found"});
        }
    });
});

// Process Data query
app.get('/bpr_db/:indType', (req, res) => {
    const tbl_name = req.params.indType;
    const sql = `SELECT * FROM ${tbl_name}`;
    client.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

//Login Check query
app.post('/bpr_db/log/login', (req, res) => {
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
});

let port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});
