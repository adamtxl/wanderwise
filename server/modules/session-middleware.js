// No changes should be required in this file

const expressSession = require('express-session');
const PgSession = require('connect-pg-simple')(expressSession);
const pool = require('./pool.js');
const warnings = require('../constants/warnings');

/*
  The session makes it so a user can enters their username and password one time,
  and then we can keep them logged in. We do this by giving them a really long random string
  that the browser will pass back to us with every single request. The long random string is
  something the server can confirm, and then we know that we have the right user.

  You can see this string that gets passed back and forth in the
  `application` ->  `storage` -> `cookies` section of the chrome debugger
*/

const isProduction = process.env.NODE_ENV === 'production';

const serverSessionSecret = () => {
  const secret = process.env.SERVER_SESSION_SECRET;
  if (!secret || secret.length < 8 || secret === warnings.exampleBadSecret) {
    // Anyone who knows the secret can forge a session cookie for any user,
    // so a deployed app must not boot with a missing or weak one.
    if (isProduction) {
      throw new Error('SERVER_SESSION_SECRET is missing or too weak; refusing to start.');
    }
    // Warning if user doesn't have a good secret
    console.log(warnings.badSecret);
    return secret || 'secret';
  }

  return secret;
};

let pruneSessionInterval = 60;
if (process.env.NODE_ENV === 'test') {
  pruneSessionInterval = false;
}
module.exports = expressSession({
  store: new PgSession({
    pool,
    pruneSessionInterval,
    createTableIfMissing: true,
  }),
  secret: serverSessionSecret(), // please set this in your .env file
  name: 'user', // this is the name of the req.variable. 'user' is convention, but not required
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // cookie expires after 7 days
    httpOnly: true, // prevents client-side JS from accessing cookie
    sameSite: 'lax', // not sent on cross-site POST/PUT/DELETE, which blocks CSRF
    // HTTPS-only in production (Fly forces HTTPS). Local dev is plain HTTP.
    // Requires `trust proxy` in server.js, since TLS ends at Fly's proxy.
    secure: isProduction,
  },
});
