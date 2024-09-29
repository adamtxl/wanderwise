import { put, takeEvery, select } from 'redux-saga/effects';

function* fetchLocations(action) {
  try {
    const itineraries = yield select(state => state.itineraries);

    if (itineraries && itineraries.length > 0) {
      const locations = itineraries.map(itinerary => ({
        latitude: itinerary.latitude,
        longitude: itinerary.longitude
      }));

      // Make sure we're not passing any null or undefined coordinates
      const validLocations = locations.filter(loc => loc.latitude && loc.longitude);

      yield put({ type: 'SET_LOCATIONS', payload: validLocations });
    } else {
      console.warn('No itineraries available to fetch locations from.');
    }
  } catch (error) {
    console.log('Error fetching locations', error);
  }
}

function* locationsSaga() {
  yield takeEvery('FETCH_LOCATIONS', fetchLocations);
}

export default locationsSaga;