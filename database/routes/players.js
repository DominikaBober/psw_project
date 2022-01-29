const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

const messages = {
    PLAYER_NOT_EXISTS: 'PLAYER_NOT_EXISTS', 
    ELEMENT_NOT_EXIST: 'ELEMENT_NOT_EXIST',
    LOGIN_DUPLICATE: 'LOGIN_DUPLICATE'
};

router.get('/', async (req, res) => {
    const players = await client.query("SELECT * FROM players");
    return res.send(players.rows);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const playerRows = await client.query("SELECT * FROM players WHERE id = $1", [id]); 
    const player = playerRows.rows[0];
    if(!player) {
        return res.status(500).send(messages.ELEMENT_NOT_EXIST);
    }
    return res.send(player);
});

router.get('/login/:login', async (req, res) => {
    const login = req.params.login;
    const playerRows = await client.query("SELECT * FROM players WHERE login = $1", [login]); 
    const player = playerRows.rows[0];
    if(!player) {
        return res.status(400).send(messages.ELEMENT_NOT_EXIST);
    }
    return res.send(player);
});

router.post('/login', async (req, res) => {
    const playerToLog = req.body;
    const playerRows = await client.query("SELECT password FROM players WHERE login = $1", [playerToLog.login]); 
    const player = playerRows.rows[0];
    if(!player) {
        return res.status(400).send(messages.ELEMENT_NOT_EXIST);
    }
    return res.send(player === playerToLog.password);
});

router.post('/', async (req, res) => {
    const playerToAdd = req.body;
    const duplicate = await client.query("SELECT * FROM players WHERE login = $1", [ playerToAdd.login]);
    if(duplicate.rows[0]) {
        return res.status(500).send(messages.LOGIN_DUPLICATE);
    }
    const insertedPlayerRows = await client.query(
        "INSERT INTO players (login, password, login_date, score, played_games, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [playerToAdd.login, playerToAdd.password, playerToAdd.login_date, 0, 0, playerToAdd.role]
    );
    const insertedplayer = insertedPlayerRows.rows[0];
    return res.send(insertedplayer);  
});

router.put('/:id', async (req, res) => {
    const playerToAdd = req.body;
    const id = req.params.id;
    if(playerToAdd.player_id) {
        const player = await client.query("SELECT * FROM players WHERE id = $1", [ playerToAdd.player_id ]);
        if(!player.rows[0]) {
            return res.status(500).send(messages.PLAYER_NOT_EXISTS);
        }
    }
    const result = await client.query(`UPDATE movie SET login = $1, password = $2, login_date = $3, score = $4, played_games = $5 role = $6 WHERE id = $7`,
    [playerToAdd.login, playerToAdd.password, playerToAdd.login_date, playerToAdd.score, playerToAdd.played_games, playerToAdd.role, id]
    );
    return result.rowCount > 0 ? res.send(playerToAdd) : res.sendStatus(400);
});

router.put('/:id/score', async (req, res) => {
    const newScore = req.body;
    const result = await client.query(`UPDATE movie SET score = $1 WHERE id = $2`,
    [newScore, id]
    );
    return result.rowCount > 0 ? res.send(playerToAdd) : res.sendStatus(400);
});

router.put('/:id/add_game', async (req, res) => {
    const result = await client.query(`UPDATE movie SET played_games = played_games + 1 WHERE id = $2`,
    [newScore, id]
    );
    return result.rowCount > 0 ? res.send(playerToAdd) : res.sendStatus(400);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const response = await client.query("DELETE from players WHERE id = $1", [id]);
    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
});

module.exports = router;
