const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

const messages = {
    PLAYER_NOT_EXISTS: 'PLAYER_NOT_EXISTS', 
    ELEMENT_NOT_EXIST: 'ELEMENT_NOT_EXIST',
    SAVE_DUPLICATE: 'SAVE_DUPLICATE'
};

router.get('/', async (req, res) => {
    const games = await client.query("SELECT * FROM games");
    return res.send(games.rows);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const gameRows = await client.query("SELECT * FROM games WHERE id = $1", [id]); 
    const game = gameRows.rows[0];
    if(!game) {
        return res.status(500).send(messages.ELEMENT_NOT_EXIST);
    }
    return res.send(game);
});

router.get('/saves/:player_id', async (req, res) => {
    const player_id = req.params.player_id;
    const games = await client.query("SELECT * FROM games WHERE player_id = $1", [player_id]);
    return res.send(games.rows);
});

router.post('/', async (req, res) => {
    const gameToAdd = req.body;

    if(gameToAdd.player_id) {
        const player = await client.query("SELECT * FROM players WHERE id = $1", [ gameToAdd.player_id ]);
        if(!player.rows[0]) {
            return res.status(500).send(messages.PLAYER_NOT_EXISTS);
        }
    }

    const insertedGameRows = await client.query(
        "INSERT INTO games (start_date, end_date, plate, finished, save, player_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [gameToAdd.start_date, null, gameToAdd.plate, false, null, gameToAdd.player_id]
      );

    const insertedGame = insertedGameRows.rows[0];
    return res.send(insertedGame);  
});

router.put('/:id', async (req, res) => {
    const gameToAdd = req.body;
    const id = req.params.id;
    if(gameToAdd.player_id) {
        const player = await client.query("SELECT * FROM players WHERE id = $1", [ gameToAdd.player_id ]);
        if(!player.rows[0]) {
            return res.status(500).send(messages.PLAYER_NOT_EXISTS);
        }
    }
    const result = await client.query(`UPDATE movie SET start_date = $1, end_date = $2, plate = $3, finished = $4, save = $5, player_id = $6 WHERE id = $7`,
        [gameToAdd.start_date, gameToAdd.end_date, gameToAdd.plate, gameToAdd.finished, gameToAdd.save, gameToAdd.player_id, id]
    );
    return result.rowCount > 0 ? res.send(gameToAdd) : res.sendStatus(400);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const response = await client.query("DELETE from games WHERE id = $1", [id]);
    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
});

router.patch('/:id/finish', async (req, res) => {
    const id = req.params.id;
    const result = await client.query(`UPDATE movie SET finished = $1 WHERE id = $2`,
        [true, id]
    );
    return result.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400);
});

router.patch('/:id/save', async (req, res) => {
    const gameToAdd = req.body.save_name
    const id = req.params.id;
    const duplicate = await client.query("SELECT * FROM games WHERE save = $1 AND id = $2", [ gameToAdd.save, id ]);
    if(duplicate.rows[0]) {
        return res.status(500).send(messages.SAVE_DUPLICATE);
    }
    const result = await client.query(`UPDATE movie SET save = $1 WHERE id = $2`,
        [gameToAdd.save, id]
    );
    return result.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400);
});

module.exports = router;
