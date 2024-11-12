// Import dependencies
const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 8080;

// Enable CORS for development (adjust origin if needed)
app.use(cors({
  origin: 'http://localhost:5173', // Change to your frontend's origin if different
  credentials: true
}));

// Middleware for JSON and URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../build'))); // Ensure path to 'build' is correct

// Passport session configuration
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// API Routes - Place all API routes here to ensure they are matched first
const userRouter = require('./routes/user.router');
const tripRouter = require('./routes/trip.router');
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

// Catch-all handler to serve `index.html` for all other routes
// Ensure this is the last route handler after all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html')); // Double-check path
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});