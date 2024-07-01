const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// GET route for master item list for logged in user
router.get('/', async (req, res) => {
    
    try {
        const packingList = await pool.query('SELECT * FROM items WHERE user_id = $1 ORDER BY item_name', [req.user.id]);
        res.json(packingList.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// POST route for user items
router.post('/', async (req, res) => {
    const { item_name, category } = req.body;
    const user_id = req.user.id;

    // SQL query to insert a new user item
    const insertText = `
        INSERT INTO items (item_name, category, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    try {
        const newItem = await pool.query(insertText, [item_name, category, user_id]);
        res.status(200).json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/:id', async (req, res) => {
    const { item_name, category } = req.body;
    const { id } = req.params;

    // SQL query to update an existing user item
    const updateText = `
        UPDATE items 
        SET item_name = $1, category = $2
        WHERE item_id = $3
        RETURNING *
    `;

    try {
        const updatedItem = await pool.query(updateText, [item_name, category, id]);
        if (updatedItem.rows.length === 0) {
            res.status(404).send('Item not found');
        } else {
            res.status(200).json(updatedItem.rows[0]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // SQL query to delete an existing user item
    const deleteText = `
        DELETE FROM items 
        WHERE item_id = $1
        RETURNING *
    `;

    try {
        const deletedItem = await pool.query(deleteText, [id]);
        if (deletedItem.rows.length === 0) {
            res.status(404).send('Item not found');
        } else {
            res.status(200).json(deletedItem.rows[0]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;