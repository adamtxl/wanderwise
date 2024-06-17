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
// Create a new trip
router.post('/', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id; 
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

// Update a trip
router.put('/:id', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    const { trip_name, start_date, end_date, locales, map_locations } = req.body;
    
    const query = `
        UPDATE "trips"
        SET "trip_name" = $1, "start_date" = $2, "end_date" = $3, "locales" = $4, "map_locations" = $5
        WHERE "trip_id" = $6 AND "user_id" = $7
        RETURNING *;
    `;
    
    pool.query(query, [trip_name, start_date, end_date, locales, map_locations, tripId, userId])
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
                message: 'Trip updated successfully'
            });
        })
        .catch(err => {
            console.error('Error updating trip:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// Delete a trip
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    
    const query = `
        DELETE FROM "trips"
        WHERE "trip_id" = $1 AND "user_id" = $2
        RETURNING *;
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
                message: 'Trip deleted successfully'
            });
        })
        .catch(err => {
            console.error('Error deleting trip:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});


// Get the itineraries in a specific trip.
router.get('/:trip_id/itineraries', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.trip_id;
    const userId = req.user.id;

    const query = `
        SELECT i.*
        FROM "itinerary" i
        JOIN "trips" t ON i.trip_id = t.trip_id
        WHERE i.trip_id = $1 AND t.user_id = $2
        ORDER BY i.day;
    `;
    
    pool.query(query, [tripId, userId])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No itineraries found for this trip'
                });
            }

            res.status(200).json({
                success: true,
                data: result.rows,
                message: 'Itineraries retrieved successfully'
            });
        })
        .catch(err => {
            console.error('Error retrieving itineraries:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

//updating itinerary
router.put('/itineraries/:id', rejectUnauthenticated, (req, res) => {
    const itineraryId = req.params.id;
    const { day, activity, location } = req.body;
    const userId = req.user.id;

    const query = `
        UPDATE "itinerary"
        SET "day" = $1, "activity" = $2, "location" = $3
        WHERE "itinerary_id" = $4
        AND "trip_id" IN (
            SELECT "trip_id" FROM "trips" WHERE "user_id" = $5
        )
        RETURNING *;
    `;

    const values = [day, activity, location, itineraryId, userId];

    pool.query(query, values)
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Itinerary not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                data: result.rows[0],
                message: 'Itinerary updated successfully'
            });
        })
        .catch(err => {
            console.error('Error updating itinerary:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

//adding new itinerary
router.post('/:trip_id/itineraries', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.trip_id;
    const { day, activity, location } = req.body;
    const userId = req.user.id;

    const query = `
        INSERT INTO "itinerary" ("trip_id", "day", "activity", "location")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [tripId, day, activity, location];

    // Verify that the user owns the trip
    const verifyTripQuery = `
        SELECT "trip_id" FROM "trips"
        WHERE "trip_id" = $1 AND "user_id" = $2;
    `;

    pool.query(verifyTripQuery, [tripId, userId])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found or unauthorized'
                });
            }

            // Insert the new itinerary
            pool.query(query, values)
                .then(result => {
                    res.status(201).json({
                        success: true,
                        data: result.rows[0],
                        message: 'Itinerary created successfully'
                    });
                })
                .catch(err => {
                    console.error('Error creating itinerary:', err);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                });
        })
        .catch(err => {
            console.error('Error verifying trip:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

//deleting itinerary
router.delete('/itineraries/:id', rejectUnauthenticated, (req, res) => {
    const itineraryId = req.params.id;
    const userId = req.user.id;

    const query = `
        DELETE FROM "itinerary"
        WHERE "itinerary_id" = $1
        AND "trip_id" IN (
            SELECT "trip_id" FROM "trips" WHERE "user_id" = $2
        )
        RETURNING *;
    `;

    const values = [itineraryId, userId];

    pool.query(query, values)
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Itinerary not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Itinerary deleted successfully'
            });
        })
        .catch(err => {
            console.error('Error deleting itinerary:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

module.exports = router;
