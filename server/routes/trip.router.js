const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');

/**
 Get all trips for that user
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id; // Use descriptive variable names
    const query = `
        SELECT * FROM "trips"
        WHERE "user_id" = $1;
    `;
    
    pool.query(query, [userId])
        .then(result => {
            res.status(200).json({
                success: true,
                data: result.rows,
                message: 'Trips retrieved successfully'
            });
        })
        .catch(err => {
            console.error('Error getting trips:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// Get individual trip for the user
router.get('/:id', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    
    const query = `
        SELECT * FROM "trips"
        WHERE "trip_id" = $1 AND "user_id" = $2;
    `;
    
    pool.query(query, [tripId, userId])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }
            res.status(200).json({
                success: true,
                data: result.rows[0],
                message: 'Trip retrieved successfully'
            });
        })
        .catch(err => {
            console.error('Error getting trip:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});
/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id; // Ensure this comes from the authenticated user session
    const { trip_name, start_date, end_date, locales, map_locations } = req.body;

    const query = `
        INSERT INTO "trips" ("user_id", "trip_name", "start_date", "end_date", "locales", "map_locations")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    pool.query(query, [userId, trip_name, start_date, end_date, locales, map_locations])
        .then(result => {
            res.status(201).json({
                success: true,
                data: result.rows[0],
                message: 'Trip created successfully'
            });
        })
        .catch(err => {
            console.error('Error creating trip:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});


module.exports = router;
