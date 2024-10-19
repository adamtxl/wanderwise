import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

// Worker saga to fetch all trip categories
function* fetchCategories() {
    try {
        console.log('Saga: Fetching categories...');
        const response = yield call(axios.get, '/api/trip-categories');
        console.log('Saga: Categories fetched:', response.data);
        yield put({ type: 'SET_CATEGORIES', payload: response.data.data });
    } catch (error) {
        console.error('Saga: Error fetching categories', error);
    }
}

// Watcher saga
function* categorySaga() {
    yield takeEvery('FETCH_CATEGORIES', fetchCategories);
}

export default categorySaga;