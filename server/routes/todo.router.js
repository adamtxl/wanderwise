const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const { checkTripOwnerOrCollaborator } = require('../modules/collaborators.middleware'); // Import the middleware

// GET all checklist items for a specific trip
router.get('/:trip_id', rejectUnauthenticated, async (req, res) => {
    const tripId = req.params.trip_id;
    try {
        const results = await pool.query('SELECT * FROM "checklist" WHERE "trip_id" = $1;', [tripId]);
        res.json(results.rows);
    } catch (error) {
        console.error('Error fetching checklist:', error);
        res.status(500).send('Server error');
    }
});

// POST a new checklist item
router.post('/', rejectUnauthenticated, async (req, res) => {
    const { trip_id, item_name, completed } = req.body;

    // Validate input
    if (!item_name) {
        return res.status(400).send('item_name is required');
    }

    const query = `INSERT INTO "checklist" ("trip_id", "item_name", "completed") VALUES ($1, $2, $3) RETURNING *;`;

    try {
        const result = await pool.query(query, [trip_id, item_name, completed || false]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST checklist:', error);
        res.status(500).send('Server error');
    }
});

// PUT route to update a checklist item (mark as complete or update item_name)
router.put('/:id', rejectUnauthenticated, async (req, res) => {
    const checklistId = req.params.id;
    const { item_name, completed } = req.body;

    // Validate input
    if (!item_name) {
        return res.status(400).send('item_name is required');
    }

    const queryText = `UPDATE "checklist" SET "item_name" = $1, "completed" = $2 WHERE "checklist_id" = $3 RETURNING *;`;
    try {
        const result = await pool.query(queryText, [item_name, completed, checklistId]);
        if (result.rowCount === 0) {
            return res.status(404).send('Checklist item not found');
        }
        res.status(200).json(result.rows[0]); // Send the updated item as the response
    } catch (error) {
        console.error('Error updating checklist item:', error);
        res.status(500).send('Server error');
    }
});

// DELETE a checklist item by id
router.delete('/:id', rejectUnauthenticated, async (req, res) => {
    const checklistId = req.params.id;

    const query = `DELETE FROM "checklist" WHERE "checklist_id" = $1 RETURNING *;`;
    try {
        const result = await pool.query(query, [checklistId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Checklist item not found' });
        }
        res.status(200).json({ message: `Checklist item with ID '${checklistId}' deleted successfully.` });
    } catch (error) {
        console.error('Error deleting checklist item:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;