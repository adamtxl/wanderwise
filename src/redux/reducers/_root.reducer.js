import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import trip from './trip.reducer';
import itineraryReducer from './itinerary.reducer';
import packingList from './packingList.reducer';
import userItems from './userItems.reducer';
import tripDetailReducer from './tripDetail.reducer';
import mapItemReducer from './mapItemReducer.js';
import locationReducer from './location.reducer.js';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  trip, // will have an array of trips
  itineraries: itineraryReducer, // will have an array of itineraries
  packingList, // will have an array of packing list items
  userItems, // will have an array of user items
  tripDetailReducer, // will have an array of trip details
  mapItems: mapItemReducer,
  location: locationReducer,
});

export default rootReducer;
