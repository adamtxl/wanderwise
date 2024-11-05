import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker Saga: will be fired on "FETCH_ITINERARIES" actions
function* fetchItineraries(action) {
    try {
        console.log('fetchItineraries action.payload:', action.payload);
        const response = yield axios.get(`/api/itinerary/${action.payload}/itineraries`);
        yield put({ type: 'SET_ITINERARIES', payload: response.data });
        yield put({ type: 'FETCH_LOCATIONS', payload: action.payload }); // Fetch locations after itineraries
    } catch (error) {
        console.log('Error fetching itineraries', error);
    }
}
// Worker Saga: will be fired on "ADD_ITINERARY" actions
function* addItinerary(action) {
    try {
        yield axios.post(`/api/itinerary/${action.payload.tripId}/itineraries`, action.payload.itinerary);
        yield put({ type: 'FETCH_ITINERARIES', payload: action.payload.tripId });
    } catch (error) {
        console.log('Error with adding itinerary:', error);
    }
}

// Worker Saga: will be fired on "UPDATE_ITINERARY" actions
function* updateItinerary(action) {
    try {
        console.log('updateItinerary action.payload:', action.payload);
        const { itinerary_id, day, activity, location, notes, trip_id } = action.payload;
        console.log(`PUT request to /api/itinerary/${action.payload.itinerary_id}`); // Log URL
        yield axios.put(`/api/itinerary/${action.payload.itinerary_id}`, { itinerary_id, day, activity, location, notes });
        yield put({ type: 'FETCH_ITINERARIES', payload: action.payload.trip_id });
    } catch (error) {
        console.log('Error with updating itinerary:', error);
    }
}

function* fetchItinerariesWithMapItems(action) {
    try {
        const response = yield axios.get(`/api/trips/${action.payload}/itineraries-with-map-items`);
        yield put({ type: 'SET_ITINERARIES_WITH_MAP_ITEMS', payload: response.data });
    } catch (error) {
        console.log('Error fetching itineraries with map items', error);
    }
}



// Worker Saga: will be fired on "DELETE_ITINERARY" actions
function* deleteItinerary(action) {
    try {
        const { itineraryId, tripId } = action.payload; // Corrected destructuring
        yield call(axios.delete, `/api/itinerary/${itineraryId}`);
        yield put({ type: 'DELETE_ITINERARY_SUCCESS', payload: itineraryId });
        yield put({ type: 'FETCH_ITINERARIES', payload: tripId });
    } catch (error) {
        console.error('Delete itinerary failed', error);
    }
}

function* fetchLocations(action) {
    try {
        const response = yield call(axios.get, `/api/trips/${action.payload}/itineraries/locations`);
        console.log('Locations fetched:', response.data.data); // Log to verify the response
        yield put({ type: 'SET_LOCATIONS', payload: response.data.data });
    } catch (error) {
        console.error('Error fetching locations:', error);
        yield put({ type: 'LOCATIONS_ERROR', payload: error.message });
    }
}


// Root saga
function* itinerarySaga() {
    yield takeEvery('FETCH_ITINERARIES', fetchItineraries);
    yield takeEvery('ADD_ITINERARY', addItinerary);
    yield takeEvery('UPDATE_ITINERARY', updateItinerary);
    yield takeEvery('DELETE_ITINERARY', deleteItinerary);
    yield takeEvery('FETCH_ITINERARIES_WITH_MAP_ITEMS', fetchItinerariesWithMapItems);
    yield takeEvery('FETCH_LOCATIONS', fetchLocations);
}

export default itinerarySaga;