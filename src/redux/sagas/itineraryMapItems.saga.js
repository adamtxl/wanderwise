import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker saga to fetch map items for a specific itinerary
function* fetchItineraryMapItems(action) {
    try {
        const response = yield call(axios.get, `/api/itinerary_map_items/${action.payload}`);
        yield put({ type: 'SET_ITINERARY_MAP_ITEMS', payload: response.data });
    } catch (error) {
        console.error('Error fetching itinerary map items:', error);
    }
}

// Worker saga to add a new map item to an itinerary
function* addItineraryMapItem(action) {
    try {
        yield call(axios.post, '/api/itinerary_map_items', action.payload);
        yield put({ type: 'FETCH_ITINERARY_MAP_ITEMS', payload: action.payload.itinerary_id });
    } catch (error) {
        console.error('Error adding itinerary map item:', error);
    }
}

// Root saga for itinerary map items
function* itineraryMapItemsSaga() {
    yield takeEvery('FETCH_ITINERARY_MAP_ITEMS', fetchItineraryMapItems);
    yield takeEvery('ADD_ITINERARY_MAP_ITEM', addItineraryMapItem);
}

export default itineraryMapItemsSaga;