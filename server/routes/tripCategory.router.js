const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');

// Get all trip categories
router.get('/', rejectUnauthenticated, (req, res) => {
    const query = `SELECT * FROM "trip_categories";`;

    pool.query(query)
        .then(result => {
            res.status(200).json({
                success: true,
                data: result.rows,
                message: 'Trip categories retrieved successfully'
            });
        })
        .catch(err => {
            console.error('Error getting trip categories:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

module.exports = router;