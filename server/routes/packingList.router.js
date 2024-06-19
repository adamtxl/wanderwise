const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// GET route for master packing list for a specific day/itinerary
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
    const { itinerary_id, predefined_items, item_name, quantity, packed } = req.body;
    try {
        const client = await pool.connect();
        await client.query('BEGIN');
        const insertText = 'INSERT INTO PackingList (itinerary_id, predefined_item_id, item_name, quantity, packed) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        for (let predefined_item_id of predefined_items) {
            const newItem = await client.query(
                insertText,
                [itinerary_id, predefined_item_id, item_name, quantity, packed]
            );
        }
        await client.query('COMMIT');
        res.status(200).send('Transaction complete.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
    } finally {
        client.release();
    }
});

// PUT route for packing list
router.put('/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const { trip_id, predefined_item_id, item_name, quantity, packed } = req.body;
    try {
        const updateItem = await pool.query(
            'UPDATE PackingList SET trip_id = $1, predefined_item_id = $2, item_name = $3, quantity = $4, packed = $5 WHERE item_id = $6 RETURNING *',
            [trip_id, predefined_item_id, item_name, quantity, packed, item_id]
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


// GET route for packing list for a specific day
router.get('/trip/:trip_id/day/:trip_day', async (req, res) => {
    const { trip_id, trip_day } = req.params;
    try {
        const packingList = await pool.query('SELECT * FROM PackingList WHERE trip_id = $1 AND trip_day = $2', [trip_id, trip_day]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});