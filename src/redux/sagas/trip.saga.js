// trips.saga.js

import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker saga to fetch all trips
function* fetchTrips() {
    try {
        console.log('Saga: Fetching trips...');
        const response = yield call(axios.get, '/api/trips');
        console.log('Saga: Trips fetched:', response.data);
        yield put({ type: 'SET_TRIPS', payload: response.data.data });
    } catch (error) {
        console.error('Saga: Error fetching trips', error);
    }
}

function* fetchPastTrips() {
    try {
        console.log('Saga: Fetching Past trips...');
        const response = yield call(axios.get, '/api/trips/past');
        console.log('Saga: Trips fetched:', response.data);
        yield put({ type: 'SET_TRIPS', payload: response.data.data });
    } catch (error) {
        console.error('Saga: Error fetching trips', error);
    }
}

// Worker saga to fetch a single trip by ID
function* fetchTripById(action) {
    try {
        console.log('Fetching trip with ID:', action.payload); // Log the action payload

        const response = yield call(axios.get, `/api/trips/${action.payload}`);

        console.log('Trip data received:', response.data); // Log the response data

        yield put({ type: 'SET_TRIP_BY_ID', payload: response.data });
    } catch (error) {
        console.error('Error fetching trip details:', error.message); // Log the error message
        yield put({ type: 'FETCH_TRIP_BY_ID_ERROR', payload: error.message });
    }
}

function* createTrip(action) {
    try {
        console.log('Saga: Creating a new trip with category...');
        const response = yield call(axios.post, '/api/trips', action.payload); // payload should include category_id
        console.log('Saga: New trip created:', response.data);
        yield put({ type: 'FETCH_TRIPS' }); // Fetch trips again after creating a new one
    } catch (error) {
        console.error('Saga: Error creating a new trip', error);
    }
}

// In your saga file
function* updateTrip(action) {
    try {
        const { trip_id, ...updatedFields } = action.payload;
        const response = yield call(axios.put, `/api/trips/${trip_id}`, updatedFields);
        console.log("Updating trip at:", `/api/trips/${trip_id}`);
        if (response.data.success) {
            yield put({ type: 'UPDATE_TRIP_SUCCESS', payload: response.data.data });
            // Optionally, fetch the updated trip to refresh data
            yield put({ type: 'FETCH_TRIP_BY_ID', payload: trip_id });
        } else {
            yield put({ type: 'UPDATE_TRIP_FAILURE', payload: response.data.message });
        }
    } catch (error) {
        console.error('Error in updateTrip saga:', error);
        yield put({ type: 'UPDATE_TRIP_FAILURE', payload: error.message });
    }
}

// Worker Saga: will be fired on "DELETE_TRIP" actions
function* deleteTrip(action) {
    try {
        yield call(axios.delete, `/api/trips/${action.payload}`);
        yield put({ type: 'FETCH_TRIPS' });
    } catch (error) {
        console.log('Error with deleting trip:', error);
    }
}


// Watcher saga to trigger worker saga
function* tripsSaga() {
    yield takeEvery('FETCH_TRIPS', fetchTrips);
    yield takeEvery('FETCH_TRIP_BY_ID', fetchTripById);
    yield takeEvery('CREATE_TRIP', createTrip);
    yield takeEvery('UPDATE_TRIP', updateTrip);
    yield takeEvery('DELETE_TRIP', deleteTrip);
    yield takeEvery('FETCH_PAST_TRIPS', fetchPastTrips);
}

export default tripsSaga;
