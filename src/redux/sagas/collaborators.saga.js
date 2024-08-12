import { put, takeEvery, call, takeLatest } from 'redux-saga/effects';
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

// Worker Saga: will be fired on "FETCH_NON_COLLABORATORS" actions
function* fetchNonCollaborators(action) {
    const tripId = action.payload;
    try {
        const response = yield call(axios.get, `/api/collaborators/non-collaborators/${tripId}`);
        yield put({ type: 'SET_NON_COLLABORATORS', payload: response.data.data });
    } catch (error) {
        console.error('Error fetching non-collaborators:', error);
    }
}

function* addCollaborator(action) {
    const { tripId, userId } = action.payload;
    try {
        yield call(axios.post, '/api/collaborators/add', { tripId, userId });
        yield put({ type: 'FETCH_COLLABORATORS', payload: tripId });
        yield put({ type: 'FETCH_NON_COLLABORATORS', payload: tripId });
    } catch (error) {
        console.error('Error adding collaborator:', error);
    }
}

// Root Saga
function* collaboratorsSaga() {
    yield takeEvery('FETCH_COLLABORATORS', fetchCollaborators);
    yield takeLatest('FETCH_NON_COLLABORATORS', fetchNonCollaborators);
    yield takeLatest('ADD_COLLABORATOR', addCollaborator);

}

export default collaboratorsSaga;