const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;


const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173', // your frontend address
  credentials: true // allow cookies to be sent across domains
}));


// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const tripRouter = require('./routes/trip.router')
const packingListRouter = require('./routes/packingList.router');
const itineraryRouter = require('./routes/itinerary.router');
const user_itemsRouter = require('./routes/userItems.router');
const mapItemRouter = require('./routes/map.router');
const mapUpdateRouter = require('./routes/map.update.router');
const uploadRouter = require('./routes/upload.router');
const collaboratorsRouter = require('./routes/collaborators.router');
const tripCategoryRouter = require('./routes/tripCategory.router');
const todoRouter = require('./routes/todo.router');
const itineraryMapItemsRouter = require('./routes/itineraryMapItemsRouter');


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
app.use('/api/user-items', user_itemsRouter);
app.use('/api/map_item', mapItemRouter);
app.use('/api/map-update', mapUpdateRouter);
app.use('/api/upload-csv', uploadRouter);
app.use('/api/collaborators', collaboratorsRouter);
app.use('/api/trip-categories', tripCategoryRouter);
app.use('/api/checklist', todoRouter);
app.use('/api/itinerary_map_items', itineraryMapItemsRouter);


// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});


const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});