const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// GET route for master packing list for logged in user
router.get('/', async (req, res) => {
    
    try {
        const packingList = await pool.query('SELECT * FROM items WHERE user_id = $1', [req.user.id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;