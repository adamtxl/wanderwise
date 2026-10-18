const pool = require('./pool');

/*
  A user can access a trip if they own it or are listed as a collaborator on it.

  accessibleTripIds / accessibleItineraryIds return SQL subqueries for scoping
  queries on rows that hang off a trip, e.g.
    WHERE "packinglist_id" = $1 AND "trip_id" IN (${accessibleTripIds('$2')})
  with req.user.id bound to $2. The argument is always a placeholder string
  written in code, never user input.
*/
const accessibleTripIds = (userParam) => `
  SELECT "trip_id" FROM "trips" WHERE "user_id" = ${userParam}
  UNION
  SELECT "trip_id" FROM "collaborators" WHERE "user_id" = ${userParam}
`;

const accessibleItineraryIds = (userParam) => `
  SELECT "itinerary_id" FROM "itinerary" WHERE "trip_id" IN (${accessibleTripIds(userParam)})
`;

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Builds middleware that checks req.user can access the record whose id
// getId(req) returns. Run after rejectUnauthenticated. Responds 404 rather
// than 403 so other users' trips aren't discoverable by id.
const requireAccess = (subquery, label) => (getId) => async (req, res, next) => {
  const id = parseId(getId(req));
  if (!id) {
    return res.status(400).json({ success: false, message: `A valid ${label} ID is required` });
  }

  try {
    const result = await pool.query(`SELECT $1::int IN (${subquery('$2')}) AS "allowed";`, [
      id,
      req.user.id,
    ]);
    if (!result.rows[0].allowed) {
      return res.status(404).json({ success: false, message: `${label} not found` });
    }
    next();
  } catch (err) {
    console.error(`Error checking ${label} access:`, err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Read the id from exactly one place, e.g. requireTripAccess((req) => req.params.tripId).
// Don't fall back between params and body: the id that is checked must be the
// id the handler uses.
const requireTripAccess = requireAccess(accessibleTripIds, 'Trip');
const requireItineraryAccess = requireAccess(accessibleItineraryIds, 'Itinerary');

// Checks req.user can access the trip in req.params.tripId and sets req.trip.
// Run after rejectUnauthenticated. Reads the id from params only, never body
// or query, so a request can't name one trip in the URL and act on another.
const checkTripAccess = async (req, res, next) => {
  const tripId = parseId(req.params.tripId);
  if (!tripId) {
    return res.status(400).json({ success: false, message: 'A valid Trip ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT t.*
       FROM "trips" t
       WHERE t."trip_id" = $1
         AND (
           t."user_id" = $2
           OR EXISTS (
             SELECT 1 FROM "collaborators" c
             WHERE c."trip_id" = t."trip_id" AND c."user_id" = $2
           )
         );`,
      [tripId, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    req.trip = result.rows[0];
    next();
  } catch (err) {
    console.error('Error checking Trip access:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  accessibleTripIds,
  accessibleItineraryIds,
  requireTripAccess,
  requireItineraryAccess,
  checkTripAccess,
};
