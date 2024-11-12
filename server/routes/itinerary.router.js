const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// retrieving itineraries
router.get('/:trip_id/itineraries', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.trip_id;
    const userId = req.user.id;

    const query = `
        SELECT i.*
        FROM "itinerary" i
        JOIN "trips" t ON i.trip_id = t.trip_id
        LEFT JOIN "collaborators" c ON t.trip_id = c.trip_id
        WHERE i.trip_id = $1 AND (t.user_id = $2 OR c.user_id = $2)
        ORDER BY i.day AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago';
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

// creating itinerary
router.post('/:trip_id/itineraries', rejectUnauthenticated, (req, res) => {
    const tripId = req.params.trip_id;
    const { day, activity, location, notes, longitude, latitude, created_at } = req.body;

    const query = `
        INSERT INTO "itinerary" ("trip_id", "day", "activity", "location", "notes", "longitude", "latitude", "created_at")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    pool.query(query, [tripId, day, activity, location, notes, longitude, latitude, created_at])
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
});

// updating itinerary
router.put('/:id', rejectUnauthenticated, (req, res) => {
    const itineraryId = req.params.id;
    const { day, activity, location, notes } = req.body;
    const userId = req.user.id;

    const query = `
        UPDATE "itinerary"
        SET "day" = $1, "activity" = $2, "location" = $3, "notes" = $4
        WHERE "itinerary_id" = $5
        AND "trip_id" IN (
            SELECT "trip_id" FROM "trips" WHERE "user_id" = $6
            UNION
            SELECT "trip_id" FROM "collaborators" WHERE "user_id" = $6
        )
        RETURNING *;
    `;

    const values = [day, activity, location, notes, itineraryId, userId];

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


router.delete('/:itineraryId', (req, res) => {
    const itineraryId = req.params.itineraryId;

    const queryText = 'DELETE FROM itinerary WHERE itinerary_id = $1 RETURNING *;';
    pool.query(queryText, [itineraryId])
        .then((result) => {
            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Itinerary not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Itinerary deleted successfully',
                data: result.rows[0]
            });
        })
        .catch((err) => {
            console.error('Error deleting itinerary:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// Link a map item to an itinerary
router.post('/:itinerary_id/map-items', rejectUnauthenticated, (req, res) => {
    const itineraryId = req.params.itinerary_id;
    const { map_item_id } = req.body;

    const query = `
        INSERT INTO itinerary_map_items (itinerary_id, map_item_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    pool.query(query, [itineraryId, map_item_id])
        .then(result => res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Map item linked to itinerary successfully'
        }))
        .catch(err => {
            console.error('Error linking map item:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// Unlink a map item from an itinerary
router.delete('/:itinerary_id/map-items/:map_item_id', rejectUnauthenticated, (req, res) => {
    const itineraryId = req.params.itinerary_id;
    const mapItemId = req.params.map_item_id;

    const query = `
        DELETE FROM itinerary_map_items
        WHERE itinerary_id = $1 AND map_item_id = $2
        RETURNING *;
    `;

    pool.query(query, [itineraryId, mapItemId])
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Link not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Map item unlinked from itinerary successfully',
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error('Error unlinking map item:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

module.exports = router;