const express = require('express');
const app = express();
const cors = require('cors');
const client = require('./config/psqlClient');
const movies = require('./routes/games');
const persons = require('./routes/players');
const actors = require('./routes/logs');

app.use(express.json());
app.use(cors());
app.use("/games", movies);
app.use("/players", persons);
app.use("/logs", actors);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  // client.query(`
  // DROP TABLE games;
  // DROP TABLE players;
  // DROP TABLE logs;
  // `);

  client.query(`
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  login VARCHAR(60) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL,
  login_date DATE NOT NULL,
  score INTEGER NOT NULL,
  played_games INTEGER NOT NULL,
  role VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  plate VARCHAR(500) NOT NULL,
  finished BOOLEAN NOT NULL,
  save VARCHAR(50) NULL,
  player_id INTEGER NOT NULL, 
  FOREIGN KEY (player_id) REFERENCES players (id)
);

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  time DATE NOT NULL,
  content VARCHAR UNIQUE NOT NULL
);
  `);

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
})
.catch(err => console.error('Connection error', err.stack));