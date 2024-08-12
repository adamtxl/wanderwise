import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker Saga: will be fired on "FETCH_COLLABORATORS" actions
function* fetchCollaborators(action) {
    const tripId = action.payload;
    console.log('tripId', tripId);
    try {
        const response = yield call(axios.get, `/api/collaborators/${tripId}`);
        yield put({ type: 'SET_COLLABORATORS', payload: response.data.data });
    } catch (error) {
        console.error('Error fetching collaborators:', error);
    }
}

// Root Saga
function* collaboratorsSaga() {
    yield takeEvery('FETCH_COLLABORATORS', fetchCollaborators);
}

export default collaboratorsSaga;