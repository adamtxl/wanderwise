const pool = require('./pool.js');

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

module.exports = { checkTripOwnerOrCollaborator }; // Export the middleware