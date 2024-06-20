import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker saga to fetch trips
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

function* createTrip(action) {
    try {
        console.log('Saga: Creating a new trip...');
        const response = yield call(axios.post, '/api/trips', action.payload);
        console.log('Saga: New trip created:', response.data);
        yield put({ type: 'FETCH_TRIPS' }); // Fetch trips again after creating a new one
    } catch (error) {
        console.error('Saga: Error creating a new trip', error);
    }
}

function* updateTrip(action) {
    try {
        yield axios.put(`/api/trips/${action.payload.trip_id}`, action.payload);
        yield put({ type: 'FETCH_TRIPS' });
    } catch (error) {
        console.log('Error with updating trip:', error);
    }
}

// Worker Saga: will be fired on "DELETE_TRIP" actions
function* deleteTrip(action) {
    try {
        yield axios.delete(`/api/trips/${action.payload}`);
        yield put({ type: 'FETCH_TRIPS' });
    } catch (error) {
        console.log('Error with deleting trip:', error);
    }
}

// Watcher saga to trigger worker saga
function* tripsSaga() {
    yield takeEvery('FETCH_TRIPS', fetchTrips);
    yield takeEvery('CREATE_TRIP', createTrip);
    yield takeEvery('UPDATE_TRIP', updateTrip);
    yield takeEvery('DELETE_TRIP', deleteTrip);
}

export default tripsSaga;
