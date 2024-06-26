const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { title, description, latitude, longitude } = req.body;
    const queryText = `COPY "testtable" ("name", description, latitude, longitude)
    FROM '/users/adamtroxell/Documents/pop22.csv'
    WITH (FORMAT csv, HEADER true);`;
    pool.query(queryText)
      .then(() => res.sendStatus(201))
      .catch((err) => {
        console.log(err);
        res.sendStatus(500)
      });
  });

module.exports = router;