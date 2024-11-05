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
    const userId = req.user.id;
    const query = `
        SELECT DISTINCT t.*
        FROM "trips" t
        LEFT JOIN "collaborators" c ON t.trip_id = c.trip_id
        WHERE (t.user_id = $1 OR c.user_id = $1)
        AND t.end_date > CURRENT_DATE AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago'
        ORDER BY t.start_date ASC;
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

router.get('/past', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT * FROM "trips"
        WHERE ("user_id" = $1 OR "collaborator" = $1)
        AND "end_date" < CURRENT_DATE AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago'
        ORDER BY "start_date" ASC;
    `;

    pool.query(query, [userId])
        .then(result => {
            res.status(200).json({
                success: true,
                data: result.rows,
                message: 'Past trips retrieved successfully'
            });
        })
        .catch(err => {
            console.error('Error getting past trips:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// Get individual trip for the user
router.get('/:id', rejectUnauthenticated, async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    console.log('Fetching trip with ID:', tripId); // Add this log to verify the trip ID

    try {
        // Check if the trip belongs to the user
        const ownerResult = await pool.query(`
            SELECT * FROM "trips"
            WHERE "trip_id" = $1 AND "user_id" = $2;
        `, [tripId, userId]);

        let trip = ownerResult.rows[0];

        // If the trip does not belong to the user, check if the user is a collaborator
        if (!trip) {
            const collaboratorResult = await pool.query(`
                SELECT t.* FROM "trips" t
                JOIN "collaborators" c ON t.trip_id = c.trip_id
                WHERE t.trip_id = $1 AND c.user_id = $2;
            `, [tripId, userId]);

            trip = collaboratorResult.rows[0];
        }

        if (trip) {
            // Fetch collaborators for the trip
            const collaboratorsResult = await pool.query(`
                SELECT "user".id, "user".username FROM "collaborators"
                JOIN "user" ON "collaborators"."user_id" = "user".id
                WHERE "collaborators"."trip_id" = $1;
            `, [tripId]);

            trip.collaborators = collaboratorsResult.rows;
            res.status(200).json({
                success: true,
                data: trip,
                message: 'Trip retrieved successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Trip not found or you do not have access'
            });
        }
    } catch (err) {
        console.error('Error retrieving trip:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Create a new trip
router.post('/', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const { trip_name, start_date, end_date, locales, map_locations, category_id } = req.body;

    const query = `
        INSERT INTO "trips" ("user_id", "trip_name", "start_date", "end_date", "locales", "map_locations", "category_id")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    pool.query(query, [userId, trip_name, start_date, end_date, locales, map_locations, category_id])
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
    const { trip_name, start_date, end_date, locales, map_locations, category_id } = req.body;

    const query = `
        UPDATE "trips"
        SET "trip_name" = $1, "start_date" = $2, "end_date" = $3, "locales" = $4, "map_locations" = $5, "category_id" = $6
        WHERE "trip_id" = $7 AND "user_id" = $8
        RETURNING *;
    `;

    pool.query(query, [trip_name, start_date, end_date, locales, map_locations, category_id, tripId, userId])
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

router.get('/:trip_id/itineraries/locations', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.trip_id;
    const userId = req.user.id;

    const query = `
        SELECT longitude, latitude 
        FROM "itinerary" 
        WHERE "trip_id" = $1
        AND EXISTS (
            SELECT 1
            FROM "trips"
            WHERE "trip_id" = $1
            AND "user_id" = $2
        );
    `;

    pool.query(query, [tripId, userId])
        .then(result => {
            res.status(200).json({
                success: true,
                data: result.rows,
                message: 'Locations retrieved successfully'
            });
        })
        .catch(err => {
            console.error('Error retrieving locations:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// Fetch itineraries and associated map items for a specific trip
router.get('/:trip_id/itineraries-with-map-items', rejectUnauthenticated, async (req, res) => {
    const tripId = req.params.trip_id;
    const userId = req.user.id;

    const query = `
        SELECT i.*, m.id AS map_item_id, m.title, m.description, m.latitude, m.longitude
        FROM "itinerary" i
        JOIN "trips" t ON i.trip_id = t.trip_id
        LEFT JOIN "itinerary_map_items" imi ON i.itinerary_id = imi.itinerary_id
        LEFT JOIN "map_items" m ON imi.map_item_id = m.id
        WHERE i.trip_id = $1 AND (t.user_id = $2 OR t.collaborator = $2)
        ORDER BY i.day;
    `;

    try {
        const result = await pool.query(query, [tripId, userId]);
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'Itineraries and map items retrieved successfully'
        });
    } catch (err) {
        console.error('Error retrieving itineraries and map items:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
