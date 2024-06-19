const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// GET route for master packing list for a specific day
router.get('/', async (req, res) => {
    
    try {
        const packingList = await pool.query('SELECT * FROM items');
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;