const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const logs = await client.query("SELECT * FROM logs");
    return res.send(logs.rows);
});

router.post('/', async (req, res) => {
    const logToAdd = req.body;
    const insertedLogsRows = await client.query(
        "INSERT INTO logs (time, content) VALUES ($1, $2) RETURNING *",
        [new Date().toISOString().slice(0, 19).replace('T', ' '), logToAdd.content]
      );
    const insertedLog = insertedLogsRows.rows[0];
    return res.send(insertedLog);  
});

module.exports = router;
