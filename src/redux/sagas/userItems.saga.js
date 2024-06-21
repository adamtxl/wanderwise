import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

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

// Delete User Item
function* deleteUserItem(action) {
    try {
        yield call(axios.delete, `/api/user-items/${action.payload}`);
        yield put({ type: 'FETCH_USER_ITEMS' }); // Refresh user items
    } catch (error) {
        console.error('Error deleting user item:', error);
    }
}

// Update User Item
function* updateUserItem(action) {
    console.log('Update payload:', action.payload); // Log the payload to the console
    try {
        yield call(axios.put, `/api/user-items/${action.payload.item_id}`, action.payload);
        yield put({ type: 'FETCH_USER_ITEMS' }); // Refresh user items
    } catch (error) {
        console.error('Error updating user item:', error);
    }
}

// Root saga for user items
function* userItemsSaga() {
    yield takeEvery('FETCH_USER_ITEMS', fetchUserItems);
    yield takeEvery('ADD_USER_ITEM', addUserItem);
    yield takeEvery('DELETE_USER_ITEM', deleteUserItem);
    yield takeEvery('UPDATE_USER_ITEM', updateUserItem);
}

export default userItemsSaga;