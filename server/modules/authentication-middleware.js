const rejectUnauthenticated = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // 401 = not logged in (403 is reserved for "logged in, but not allowed")
    res.sendStatus(401);
  }
};

// Admin-only routes. Run after rejectUnauthenticated.
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated, requireAdmin };
