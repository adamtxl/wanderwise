const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT * from "map_items" order by created_at;';
  pool.query(queryText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.post('/', rejectUnauthenticated, (req, res) => {
  const { title, description, latitude, longitude } = req.body;
  const queryText = 'INSERT INTO "map_items" (title, description, latitude, longitude) VALUES ($1, $2, $3, $4);';
  pool.query(queryText, [title, description, latitude, longitude])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
