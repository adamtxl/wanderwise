import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker Saga: will be fired on "FETCH_ITINERARIES" actions
function* fetchItineraries(action) {
    try {
        const response = yield call(axios.get, `/api/itinerary/${action.payload}/itineraries`);
        yield put({ type: 'SET_ITINERARIES', payload: response.data });
    } catch (error) {
        console.error('Fetch itineraries failed', error);
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
        const { itineraryId, day, activity, location, notes, tripId } = action.payload;
        console.log(`PUT request to /api/itinerary/itineraries/${itineraryId}`); // Log URL
        yield axios.put(`/api/itinerary/itineraries/${itineraryId}`, { day, activity, location, notes });
        yield put({ type: 'FETCH_ITINERARIES', payload: tripId });
    } catch (error) {
        console.log('Error with updating itinerary:', error);
    }
}




// Worker Saga: will be fired on "DELETE_ITINERARY" actions
function* deleteItinerary(action) {
    try {
        const { itineraryId } = action.payload;
        yield call(axios.delete, `/api/itinerary/${itineraryId}`);
        yield put({ type: 'DELETE_ITINERARY_SUCCESS', payload: itineraryId });
    } catch (error) {
        console.error('Delete itinerary failed', error);
    }
}

// Root saga
function* itinerarySaga() {
    yield takeEvery('FETCH_ITINERARIES', fetchItineraries);
    yield takeEvery('ADD_ITINERARY', addItinerary);
    yield takeEvery('UPDATE_ITINERARY', updateItinerary);
    yield takeEvery('DELETE_ITINERARY', deleteItinerary);
}

export default itinerarySaga;