import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// upload a file (from filestack) to the backend
function* createMapItem(action) {
  try {
    // clear any alerts that may be in there already
    yield put({type: 'CLEAR_ALERT'});

    yield axios.post('/api/map_item', action.payload);
    // dispatch an alert that the upload was successful
    yield put({type: 'SET_ALERT', payload: { message: 'Successfully created a map item!', alert: 'alert-success' }});
    // refresh list of uploads
    yield put({type: 'FETCH_MAP_ITEMS'});
  } catch (error) {
    // dispatch an error that the upload was rejected
    yield put({type: 'SET_ALERT', payload: { message: 'Error creating map item', alert: 'alert-error' }});
    console.log('Error getting map items from server:', error);
  }
}

// Refresh the global list of uploads from the database
function* fetchMapItems() {
  try {
    const response = yield axios.get('/api/map_item');
    // add the upload to the redux store
    yield put({type: 'SET_MAP_ITEMS', payload: response.data});
  } catch (error) {
    // dispatch an error that the upload was rejected
    yield put({type: 'SET_ALERT', payload: { message: 'Error retrieving map items', alert: 'alert-error' }});
    console.log('Error getting map items from server:', error);
  }
}

function* mapItemSaga() {
  yield takeLatest('CREATE_MAP_ITEM', createMapItem);
  yield takeLatest('FETCH_MAP_ITEMS', fetchMapItems);
}

export default mapItemSaga;
