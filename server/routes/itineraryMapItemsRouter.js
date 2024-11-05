const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// Create a new map item
router.post('/', rejectUnauthenticated, async (req, res) => {
    const { itinerary_id, map_item_id } = req.body;
    const query = `
        INSERT INTO itinerary_map_items (itinerary_id, map_item_id)
        VALUES ($1, $2) RETURNING *;
    `;

    try {
        const result = await pool.query(query, [itinerary_id, map_item_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /itinerary_map_items:', error);
        res.status(500).json({ error: 'Failed to create map item' });
    }
});

// Get all map items for a specific itinerary
router.get('/:itinerary_id', rejectUnauthenticated, async (req, res) => {
    const query = `
        SELECT * FROM itinerary_map_items
        WHERE itinerary_id = $1;
    `;

    try {
        const result = await pool.query(query, [req.params.itinerary_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in GET /itinerary_map_items:', error);
        res.status(500).json({ error: 'Failed to get map items' });
    }
});

// Update an existing map item
router.put('/:id', rejectUnauthenticated, async (req, res) => {
    const { id } = req.params;
    const { itinerary_id, map_item_id } = req.body;
    const query = `
        UPDATE itinerary_map_items
        SET itinerary_id = $1, map_item_id = $2
        WHERE id = $3 RETURNING *;
    `;

    try {
        const result = await pool.query(query, [itinerary_id, map_item_id, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in PUT /itinerary_map_items:', error);
        res.status(500).json({ error: 'Failed to update map item' });
    }
});

// Delete a map item
router.delete('/:id', rejectUnauthenticated, async (req, res) => {
    const query = `
        DELETE FROM itinerary_map_items
        WHERE id = $1 RETURNING *;
    `;

    try {
        const result = await pool.query(query, [req.params.id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in DELETE /itinerary_map_items:', error);
        res.status(500).json({ error: 'Failed to delete map item' });
    }
});

module.exports = router;