const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// Middleware to check if the user is the owner of the trip
const checkTripOwnerOrCollaborator = async (req, res, next) => {
    const tripId = req.body.tripId || req.params.tripId;
    const userId = req.user.id;

    const ownerQuery = `SELECT * FROM "trips" WHERE "trip_id" = $1 AND "user_id" = $2`;
    const collaboratorQuery = `SELECT * FROM "collaborators" WHERE "trip_id" = $1 AND "user_id" = $2`;

    try {
        const ownerResult = await pool.query(ownerQuery, [tripId, userId]);
        const collaboratorResult = await pool.query(collaboratorQuery, [tripId, userId]);

        if (ownerResult.rows.length === 0 && collaboratorResult.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this trip'
            });
        }
        next();
    } catch (err) {
        console.error('Error checking trip owner or collaborator:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Add a collaborator to a trip
router.post('/add', rejectUnauthenticated, checkTripOwnerOrCollaborator, (req, res) => {
    const { tripId, userId } = req.body;

    const query = `
        INSERT INTO "collaborators" ("trip_id", "user_id")
        VALUES ($1, $2)
        RETURNING *;
    `;

    pool.query(query, [tripId, userId])
        .then(result => {
            res.status(201).json({
                success: true,
                data: result.rows[0],
                message: 'Collaborator added successfully'
            });
        })
        .catch(err => {
            console.error('Error adding collaborator:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// List collaborators for a trip
router.get('/non-collaborators/:tripId', rejectUnauthenticated, checkTripOwnerOrCollaborator, async (req, res) => {
    const tripId = req.params.tripId;

    const query = `
        SELECT u.id, u.username
        FROM "user" u
        WHERE u.id NOT IN (
            SELECT c.user_id
            FROM "collaborators" c
            WHERE c.trip_id = $1
        )
        AND u.id NOT IN (
            SELECT t.user_id
            FROM "trips" t
            WHERE t.trip_id = $1
        );
    `;

    try {
        const result = await pool.query(query, [tripId]);
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'Non-collaborators retrieved successfully'
        });
    } catch (err) {
        console.error('Error retrieving non-collaborators:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Remove a collaborator from a trip
router.delete('/remove', rejectUnauthenticated, checkTripOwnerOrCollaborator, (req, res) => {
    const { tripId, userId } = req.body;

    const query = `
        DELETE FROM "collaborators"
        WHERE "trip_id" = $1 AND "user_id" = $2
        RETURNING *;
    `;

    pool.query(query, [tripId, userId])
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Collaborator not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Collaborator removed successfully'
            });
        })
        .catch(err => {
            console.error('Error removing collaborator:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
});

// Fetch users who are not collaborators for a specific trip
router.get('/non-collaborators/:tripId', rejectUnauthenticated, checkTripOwnerOrCollaborator, async (req, res) => {
    const tripId = req.params.tripId;

    const query = `
        SELECT u.id, u.username
        FROM "user" u
        WHERE u.id NOT IN (
            SELECT c.user_id
            FROM "collaborators" c
            WHERE c.trip_id = $1
        )
        AND u.id NOT IN (
            SELECT t.user_id
            FROM "trips" t
            WHERE t.trip_id = $1
        );
    `;

    try {
        const result = await pool.query(query, [tripId]);
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'Non-collaborators retrieved successfully'
        });
    } catch (err) {
        console.error('Error retrieving non-collaborators:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.get('/:tripId', checkTripOwnerOrCollaborator, async (req, res) => {
    const tripId = req.params.tripId;

    const query = `
        SELECT u.id, u.username
        FROM "user" u
        JOIN "collaborators" c ON u.id = c.user_id
        WHERE c.trip_id = $1;
    `;

    try {
        const result = await pool.query(query, [tripId]);
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'Collaborators retrieved successfully'
        });
    } catch (err) {
        console.error('Error retrieving collaborators:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
