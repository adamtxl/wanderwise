const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');

// GET route for master packing list for a specific day
router.get('/itinerary/:itinerary_id', rejectUnauthenticated, async (req, res) => {
    const { itinerary_id } = req.params;
    try {
        const packingList = await pool.query('SELECT * FROM PackingList WHERE itinerary_id = $1', [itinerary_id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// GET route for packing list for a whole trip
router.get('/itineraries/:trip_id', rejectUnauthenticated, async (req, res) => {
    const { trip_id } = req.params;
    try {
        const packingList = await pool.query('SELECT * FROM PackingList WHERE trip_id = $1', [trip_id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});



// POST route for packing list
router.post('/', rejectUnauthenticated, async (req, res) => {
    const { item_name, quantity, packed, trip_id } = req.body; // Include trip_id

    // SQL query to insert a new packing list item
    const insertText = `
        INSERT INTO PackingList (item_name, quantity, packed, trip_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
    `;

    try {
        const client = await pool.connect();
        try {
            // Starting a transaction
            await client.query('BEGIN');

            const result = await client.query(insertText, [
                
                item_name,
                quantity,
                packed,
                trip_id // Include trip_id
            ]);

            // Committing the transaction
            await client.query('COMMIT');
            res.status(200).json(result.rows[0]);
        } catch (err) {
            // Rolling back the transaction in case of error
            await client.query('ROLLBACK');
            console.error('Transaction error:', err.message);
            res.status(500).send('Server error');
        } finally {
            // Releasing the client back to the pool
            client.release();
        }
    } catch (err) {
        console.error('Connection error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;


// PUT route for packing list
router.put('/:packinglist_id', rejectUnauthenticated, async (req, res) => {
    const { packinglist_id } = req.params;
    const { item_name, quantity, packed } = req.body;
    try {
        const updateItem = await pool.query(
            'UPDATE PackingList SET item_name = $1, quantity = $2, packed = $3 WHERE packinglist_id = $4 RETURNING *',
            [item_name, quantity, packed, packinglist_id]
        );
        res.json(updateItem.rows[0]);
    } catch (err) {
        console.error('Error updating packing list item:', err);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

// DELETE route for packing list
router.delete('/:item_id', rejectUnauthenticated, async (req, res) => {
    const { item_id } = req.params; // Correctly getting item_id from req.params
    try {
        const deleteItem = await pool.query('DELETE FROM PackingList WHERE packinglist_id = $1', [item_id]);
        res.json({ message: 'Item was deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

module.exports = router;