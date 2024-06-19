const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// GET route for master packing list for a specific day
router.get('/itinerary/:itinerary_id', async (req, res) => {
    const { itinerary_id } = req.params;
    try {
        const packingList = await pool.query('SELECT * FROM PackingList WHERE itinerary_id = $1', [itinerary_id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// GET route for packing list for a whole trip
router.get('/itineraries/:trip_id', async (req, res) => {
    const { trip_id } = req.params;
    try {
        const packingList = await pool.query('SELECT * FROM PackingList JOIN itinerary ON itinerary.itinerary_id = packinglist.itinerary_id WHERE trip_id = $1', [trip_id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});



// POST route for packing list
router.post('/', async (req, res) => {
    const { itinerary_id, item_name, quantity, packed } = req.body;

    // SQL query to insert a new packing list item
    const insertText = `
        INSERT INTO PackingList (itinerary_id, item_name, quantity, packed)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    try {
        const client = await pool.connect();
        try {
            // Starting a transaction
            await client.query('BEGIN');

            const result = await client.query(insertText, [
                itinerary_id,
                item_name,
                quantity,
                packed
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
router.put('/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const { itinerary_id, item_name, quantity, packed } = req.body;
    try {
        const updateItem = await pool.query(
            'UPDATE PackingList SET itinerary_id = $1, item_name = $2, quantity = $3, packed = $4 WHERE item_id = $5 RETURNING *',
            [itinerary_id, item_name, quantity, packed, item_id]
        );
        res.json(updateItem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// DELETE route for packing list
router.delete('/:item_id', async (req, res) => {
    const { item_id } = req.params;
    try {
        const deleteItem = await pool.query('DELETE FROM PackingList WHERE item_id = $1', [item_id]);
        res.json({ message: 'Item was deleted' });
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;