import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker Saga: will be fired on "FETCH_ITINERARIES" actions
function* fetchItineraries(action) {
    try {
        console.log('fetchItineraries action.payload:', action.payload);
        const response = yield axios.get(`/api/itinerary/${action.payload}/itineraries`);
        yield put({ type: 'SET_ITINERARIES', payload: response.data });
        yield put({ type: 'FETCH_LOCATIONS', payload: action.payload }); // Fetch locations after itineraries
    } catch (error) {
        console.log('Error fetching itineraries', error);
    }
}
// Worker Saga: will be fired on "ADD_ITINERARY" actions
function* addItinerary(action) {
    try {
        const response = yield call(axios.post, `/api/itinerary/${action.payload.tripId}/itineraries`, action.payload.itinerary);
        const newItineraryId = response.data.id; 

        // Dispatch to refresh itineraries
        yield put({ type: 'FETCH_ITINERARIES', payload: action.payload.tripId });

        // Add the map item to the itinerary once created
        yield put({
            type: 'ADD_ITINERARY_MAP_ITEM',
            payload: {
                itinerary_id: newItineraryId,
                map_item_id: action.payload.mapItemId, // Pass the selected map item ID
            },
        });
    } catch (error) {
        console.log('Error with adding itinerary:', error);
    }
}

// Worker Saga: will be fired on "UPDATE_ITINERARY" actions
function* updateItinerary(action) {
    try {
        console.log('updateItinerary action.payload:', action.payload);
        const { itinerary_id, day, activity, location, notes, trip_id } = action.payload;
        console.log(`PUT request to /api/itinerary/${action.payload.itinerary_id}`); // Log URL
        yield axios.put(`/api/itinerary/${action.payload.itinerary_id}`, { itinerary_id, day, activity, location, notes });
        yield put({ type: 'FETCH_ITINERARIES', payload: action.payload.trip_id });
    } catch (error) {
        console.log('Error with updating itinerary:', error);
    }
}

function* fetchItinerariesWithMapItems(action) {
    try {
        const response = yield axios.get(`/api/trips/${action.payload}/itineraries-with-map-items`);
        yield put({ type: 'SET_ITINERARIES_WITH_MAP_ITEMS', payload: response.data });
    } catch (error) {
        console.log('Error fetching itineraries with map items', error);
    }
}



// Worker Saga: will be fired on "DELETE_ITINERARY" actions
function* deleteItinerary(action) {
    try {
        const { itineraryId, tripId } = action.payload; // Corrected destructuring
        yield call(axios.delete, `/api/itinerary/${itineraryId}`);
        yield put({ type: 'DELETE_ITINERARY_SUCCESS', payload: itineraryId });
        yield put({ type: 'FETCH_ITINERARIES', payload: tripId });
    } catch (error) {
        console.error('Delete itinerary failed', error);
    }
}

function* fetchLocations(action) {
    try {
        const response = yield call(axios.get, `/api/trips/${action.payload}/itineraries/locations`);
        console.log('Locations fetched:', response.data.data); // Log to verify the response
        yield put({ type: 'SET_LOCATIONS', payload: response.data.data });
    } catch (error) {
        console.error('Error fetching locations:', error);
        yield put({ type: 'LOCATIONS_ERROR', payload: error.message });
    }
}


// Worker Saga: Fetch map items for an itinerary
function* fetchItineraryMapItems(action) {
    try {
        const response = yield call(axios.get, `/api/itinerary_map_items/${action.payload}`);
        yield put({ type: 'SET_ITINERARY_MAP_ITEMS', payload: response.data });
    } catch (error) {
        console.error('Error fetching itinerary map items:', error);
    }
}

// Worker Saga: Add a map item to an itinerary
function* addItineraryMapItem(action) {
    try {
        const { itinerary_id, map_item_id } = action.payload;
        yield call(axios.post, '/api/itinerary_map_items', { itinerary_id, map_item_id });
        yield put({ type: 'FETCH_ITINERARY_MAP_ITEMS', payload: itinerary_id }); // Re-fetch after adding
    } catch (error) {
        console.error('Error adding itinerary map item:', error);
    }
}

// Worker Saga: Update a map item
function* updateItineraryMapItem(action) {
    try {
        const { id, itinerary_id, map_item_id } = action.payload;
        yield call(axios.put, `/api/itinerary_map_items/${id}`, { itinerary_id, map_item_id });
        yield put({ type: 'FETCH_ITINERARY_MAP_ITEMS', payload: itinerary_id }); // Re-fetch after updating
    } catch (error) {
        console.error('Error updating itinerary map item:', error);
    }
}

// Worker Saga: Delete a map item
function* deleteItineraryMapItem(action) {
    try {
        const { id, itinerary_id } = action.payload;
        yield call(axios.delete, `/api/itinerary_map_items/${id}`);
        yield put({ type: 'FETCH_ITINERARY_MAP_ITEMS', payload: itinerary_id }); // Re-fetch after deleting
    } catch (error) {
        console.error('Error deleting itinerary map item:', error);
    }
}

function* itinerarySaga() {
    yield takeEvery('FETCH_ITINERARIES', fetchItineraries);
    yield takeEvery('ADD_ITINERARY', addItinerary);
    yield takeEvery('UPDATE_ITINERARY', updateItinerary);
    yield takeEvery('DELETE_ITINERARY', deleteItinerary);
    yield takeEvery('FETCH_ITINERARIES_WITH_MAP_ITEMS', fetchItinerariesWithMapItems);
    yield takeEvery('FETCH_LOCATIONS', fetchLocations);
    yield takeEvery('FETCH_ITINERARY_MAP_ITEMS', fetchItineraryMapItems);
    yield takeEvery('ADD_ITINERARY_MAP_ITEM', addItineraryMapItem);
    yield takeEvery('UPDATE_ITINERARY_MAP_ITEM', updateItineraryMapItem);
    yield takeEvery('DELETE_ITINERARY_MAP_ITEM', deleteItineraryMapItem);
}

export default itinerarySaga;