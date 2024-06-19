const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const tripRouter = require('./routes/trip.router')
const packingListRouter = require('./routes/packingList.router');
const itineraryRouter = require('./routes/itinerary.router');
const predefined_itemsRouter = require('./routes/userItems.router');

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/trips', tripRouter);
app.use('/api/packing-list', packingListRouter);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/predefined_items', predefined_itemsRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
