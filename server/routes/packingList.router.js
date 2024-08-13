const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
  const { checkTripOwnerOrCollaborator } = require('../modules/collaborators.middleware'); // Import the middleware

// GET route for master packing list for a specific day
router.get('/itinerary/:itinerary_id', rejectUnauthenticated, async (req, res) => {
    const { itinerary_id } = req.params;
    try {
        const packingList = await pool.query('SELECT * FROM PackingList WHERE itinerary_id = $1', [itinerary_id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET route for packing list for a whole trip
router.get('/itineraries/:trip_id', rejectUnauthenticated, async (req, res) => {
    const { trip_id } = req.params;
    try {
        const packingList = await pool.query('SELECT * FROM PackingList WHERE trip_id = $1 ORDER BY item_name ASC', [trip_id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// POST route for packing list
router.post('/', rejectUnauthenticated, async (req, res) => {
    const { item_name, quantity, packed, trip_id } = req.body;

    const insertText = `
        INSERT INTO PackingList (item_name, quantity, packed, trip_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
    `;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(insertText, [
                item_name,
                quantity,
                packed,
                trip_id
            ]);

            await client.query('COMMIT');
            res.status(200).json(result.rows[0]);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Transaction error:', err.message);
            res.status(500).send('Server error');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Connection error:', err.message);
        res.status(500).send('Server error');
    }
});


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
        console.error('Error updating packing list item:', err.message);
        res.status(500).send('Server error');
    }
});

// DELETE route for packing list
router.delete('/:packinglist_id', rejectUnauthenticated, async (req, res) => {
    const { packinglist_id } = req.params;

    try {
        const deleteQuery = 'DELETE FROM PackingList WHERE packinglist_id = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [packinglist_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item was deleted' });
    } catch (err) {
        console.error('Error deleting packing list item:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;