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

// Watcher saga to trigger worker saga
function* tripsSaga() {
    yield takeEvery('FETCH_TRIPS', fetchTrips);
}

export default tripsSaga;
