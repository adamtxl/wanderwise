const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');

/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    const id = req.user.id;
    const query = `
SELECT * FROM "trips"
WHERE "user_id" = $1;`;
pool.query(query, [id])
    .then(result => {
        res.send(result.rows);
    }).catch (err => {
        console.log('Error getting trips', err);
        res.sendStatus(500)
    })
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
