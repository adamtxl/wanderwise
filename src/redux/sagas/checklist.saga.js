import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker Saga: Fetch checklist items for a trip
function* fetchChecklist(action) {
    try {
        const tripId = action.payload;
        console.log(`Fetching checklist for trip ID: ${tripId}`);
        const response = yield call(axios.get, `/api/checklist/${tripId}`);
        yield put({ type: 'SET_CHECKLIST', payload: response.data });
    } catch (error) {
        console.error('Error fetching checklist:', error);
    }
}

// Worker Saga: Add a new checklist item
function* addChecklistItem(action) {
    try {
        const newItem = action.payload;
        console.log('Adding checklist item:', newItem);
        yield call(axios.post, '/api/checklist', newItem);
        yield put({ type: 'FETCH_CHECKLIST', payload: newItem.trip_id });  // Refetch checklist after adding
    } catch (error) {
        console.error('Error adding checklist item:', error);
    }
}

// Worker Saga: Update a checklist item (e.g., mark as complete)
function* updateChecklistItem(action) {
    try {
        const { checklistId, updatedItem } = action.payload;
        console.log(`Updating checklist item ID: ${checklistId}`, updatedItem);
        yield call(axios.put, `/api/checklist/${checklistId}`, updatedItem);
        yield put({ type: 'FETCH_CHECKLIST', payload: updatedItem.trip_id });  // Refetch checklist after update
    } catch (error) {
        console.error('Error updating checklist item:', error);
    }
}

// Worker Saga: Delete a checklist item
function* deleteChecklistItem(action) {
    try {
        const checklistId = action.payload;
        console.log(`Deleting checklist item ID: ${checklistId}`);
        yield call(axios.delete, `/api/checklist/${checklistId}`);
        yield put({ type: 'FETCH_CHECKLIST', payload: action.trip_id });  // Refetch checklist after delete
    } catch (error) {
        console.error('Error deleting checklist item:', error);
    }
}

// Watcher Saga
function* checklistSaga() {
    yield takeEvery('FETCH_CHECKLIST', fetchChecklist);
    yield takeEvery('ADD_CHECKLIST_ITEM', addChecklistItem);
    yield takeEvery('UPDATE_CHECKLIST_ITEM', updateChecklistItem);
    yield takeEvery('DELETE_CHECKLIST_ITEM', deleteChecklistItem);
}

export default checklistSaga;