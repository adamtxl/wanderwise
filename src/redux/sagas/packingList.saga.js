import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

// Fetch Packing List
function* fetchPackingList(action) {
    try {
        const { tripId } = action.payload;
        const response = yield call(axios.get, `/api/packing-list/itineraries/${tripId}`);
        console.log('Response:', response); // Add this line
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
        // Refresh packing list after the new item has been added
        yield put({ type: 'FETCH_PACKING_LIST', payload: { tripId: action.payload.trip_id } }); // Ensure correct property name
    } catch (error) {
        console.error('Error adding packing list item:', error);
    }
}

function* updatePackingListItem(action) {
    try {
        const { packinglist_id, item_name, quantity, packed } = action.payload;
        const response = yield call(axios.put, `/api/packing-list/${packinglist_id}`, {
            item_name,
            quantity,
            packed,
        });
        // Ensure you are sending the correct trip ID in the payload
        yield put({ type: 'FETCH_PACKING_LIST', payload: { tripId: response.data.trip_id } });
    } catch (error) {
        console.error('Error updating packing list item:', error);
    }
}

function* deletePackingListItem(action) {
    try {
        const { packinglist_id, tripId } = action.payload;
        yield call(axios.delete, `/api/packing-list/${packinglist_id}`);
        yield put({ type: 'FETCH_PACKING_LIST', payload: { tripId } });
    } catch (error) {
        console.error('Error deleting packing list item:', error);
    }
}
// Root saga for packing list
function* packingListSaga() {
    yield takeEvery('FETCH_PACKING_LIST', fetchPackingList);
    yield takeEvery('FETCH_USER_ITEMS', fetchUserItems);
    yield takeEvery('ADD_USER_ITEM', addUserItem);
    yield takeEvery('ADD_PACKING_LIST_ITEM', addPackingListItem);
    yield takeEvery('UPDATE_PACKING_LIST_ITEM', updatePackingListItem);
    yield takeEvery('DELETE_PACKING_LIST_ITEM', deletePackingListItem);
}

export default packingListSaga;