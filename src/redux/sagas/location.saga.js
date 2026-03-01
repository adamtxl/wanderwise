import { put, takeEvery, select } from 'redux-saga/effects';

function* fetchLocations(action) {
  try {
    // Select the correct nested array — itinerariesWithMapItems has lat/lng from the JOIN
    const itinerariesWithMapItems = yield select(state => state.itineraries.itinerariesWithMapItems);
    const itineraries = yield select(state => state.itineraries.itineraries);

    // itineraries has direct lat/lng entered by user
    // itinerariesWithMapItems only has coords when a map pin is explicitly linked
    // Always prefer itineraries for coordinates, fall back to itinerariesWithMapItems
    const fromItineraries = (itineraries || [])
      .filter(i => i.latitude && i.longitude)
      .map(i => ({ latitude: i.latitude, longitude: i.longitude, itinerary_id: i.itinerary_id }));

    const fromMapItems = (itinerariesWithMapItems || [])
      .filter(i => i.latitude && i.longitude)
      .map(i => ({ latitude: i.latitude, longitude: i.longitude, title: i.title, itinerary_id: i.itinerary_id }));

    const validLocations = fromItineraries.length > 0 ? fromItineraries : fromMapItems;

    if (validLocations.length > 0) {
      yield put({ type: 'SET_LOCATIONS', payload: validLocations });
    } else {
      console.warn('No valid coordinates found in itineraries or map items.');
    }
  } catch (error) {
    console.log('Error fetching locations', error);
  }
}

function* locationsSaga() {
  yield takeEvery('FETCH_LOCATIONS', fetchLocations);
}

export default locationsSaga;