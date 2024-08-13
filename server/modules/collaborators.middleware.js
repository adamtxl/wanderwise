const pool = require('./pool.js');

const checkTripOwnerOrCollaborator = async (req, res, next) => {
    console.log('Request body:', req.body);
    console.log('Request params:', req.params);

    const tripId = req.body.tripId || req.params.tripId || req.body.trip_id || req.params.trip_id;
    const userId = req.user.id;

    console.log('Checking trip ownership or collaboration for tripId:', tripId, 'and userId:', userId);

    const ownerQuery = `SELECT * FROM "trips" WHERE "trip_id" = $1 AND "user_id" = $2`;
    const collaboratorQuery = `SELECT * FROM "collaborators" WHERE "trip_id" = $1 AND "user_id" = $2`;

    try {
        const ownerResult = await pool.query(ownerQuery, [tripId, userId]);
        const collaboratorResult = await pool.query(collaboratorQuery, [tripId, userId]);

        console.log('Owner result:', ownerResult.rows);
        console.log('Collaborator result:', collaboratorResult.rows);

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

module.exports = { checkTripOwnerOrCollaborator };