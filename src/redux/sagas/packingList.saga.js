import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

// Fetch Packing List
function* fetchPackingList(action) {
    try {
        const { tripId, itineraryId } = action.payload;
        const response = yield call(axios.get, `/api/packing-list/${tripId}/${itineraryId}`);
        yield put({ type: 'SET_PACKING_LIST', payload: response.data });
    } catch (error) {
        console.error('Error fetching packing list:', error);
    }
}

// Fetch User Items
function* fetchUserItems() {
    try {
        const response = yield call(axios.get, '/api/user-items');
        yield put({ type: 'SET_USER_ITEMS', payload: response.data });
    } catch (error) {
        console.error('Error fetching user items:', error);
    }
}

// Add User Item
function* addUserItem(action) {
    try {
        yield call(axios.post, '/api/user-items', action.payload);
        yield put({ type: 'FETCH_USER_ITEMS' }); // Refresh user items
    } catch (error) {
        console.error('Error adding user item:', error);
    }
}

// Add Packing List Item
function* addPackingListItem(action) {
    try {
        yield call(axios.post, '/api/packing-list', action.payload);
        yield put({ type: 'FETCH_PACKING_LIST', payload: { tripId: action.payload.tripId, itineraryId: action.payload.itineraryId } }); // Refresh packing list
    } catch (error) {
        console.error('Error adding packing list item:', error);
    }
}

// Root saga for packing list
function* packingListSaga() {
    yield takeEvery('FETCH_PACKING_LIST', fetchPackingList);
    yield takeEvery('FETCH_USER_ITEMS', fetchUserItems);
    yield takeEvery('ADD_USER_ITEM', addUserItem);
    yield takeEvery('ADD_PACKING_LIST_ITEM', addPackingListItem);
}

export default packingListSaga;