import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

function* fetchLocations(action) {
    try {
        const response = yield call(axios.get, `/api/trips/${action.payload}/itineraries/locations`);
        yield put({ type: 'SET_LOCATIONS', payload: response.data.data });
    } catch (error) {
        console.error('Saga: Error fetching locations', error);
    }
}
function* locationsSaga() {
    yield takeEvery('FETCH_LOCATIONS', fetchLocations);
}

export default locationsSaga;