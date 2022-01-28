const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const logs = await client.query("SELECT * FROM logs");
    return res.send(logs.rows);
});

module.exports = router;
