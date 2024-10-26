const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET all checklist items for a specific trip
router.get('/:trip_id', function (req, res) {
    console.log('In GET route');
    const tripId = req.params.trip_id;
    const query = 'SELECT * FROM "checklist" WHERE "trip_id" = $1;';
    pool.query(query, [tripId]).then((results) => {
        res.send(results.rows); 
    }).catch((error) => {
        console.log('Error making GET', error);
        res.sendStatus(500);
    });
}); // END GET ROUTE

// POST a new checklist item
router.post('/', function (req, res) {
    const checklistItem = req.body; 
    console.log('In POST route - item:', checklistItem); 
    const query = `INSERT INTO "checklist" ("trip_id", "item_name", "completed") 
                   VALUES ($1, $2, $3);`;
    pool.query(query, [checklistItem.trip_id, checklistItem.item_name, checklistItem.completed || false])
        .then(() => {
            res.sendStatus(201);
        }).catch((error) => {
            console.log('Error in POST', error);
            res.sendStatus(500);
        });
});

// DELETE a checklist item by id
router.delete('/:id', function (req, res) {
    console.log('In DELETE route');
    const checklistId = req.params.id;
    const query = `DELETE FROM "checklist" WHERE "checklist_id" = $1;`;
    pool.query(query, [checklistId])
        .then(() => {
            console.log('Deleting item');
            res.status(200).json({ message: `Checklist item with ID '${checklistId}' deleted successfully.` });
        })
        .catch((error) => {
            console.log('Error making DELETE request', error);
            res.sendStatus(500);
        });
});

// PUT route to update a checklist item (mark as complete)
router.put('/:id', (req, res) => {
    const checklistId = req.params.id;
    const queryText = 'UPDATE "checklist" SET "completed" = $1 WHERE "checklist_id" = $2;';
    pool.query(queryText, [req.body.completed, checklistId])
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log('Error updating checklist item', error);
            res.sendStatus(500);
        });
});

module.exports = router;