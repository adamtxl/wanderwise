import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker saga to fetch trips
function* fetchTrips() {
    try {
        const response = yield call(axios.get, '/api/trips'); 
        yield put({ type: 'SET_TRIPS', payload: response.data.data }); // Ensure this is the correct path to the data
    } catch (error) {
        console.error('Error fetching trips', error);
    }
}

// Watcher saga to trigger worker saga
function* tripsSaga() {
    yield takeEvery('FETCH_TRIPS', fetchTrips);
}

export default tripsSaga;
