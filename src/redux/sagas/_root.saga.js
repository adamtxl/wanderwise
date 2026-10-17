import { all } from 'redux-saga/effects';

import categorySaga from './category.saga';
import checklistSaga from './checklist.saga';
import collaboratorsSaga from './collaborators.saga';
import itinerarySaga from './itinerary.saga';
import itineraryMapItemsSaga from './itineraryMapItems.saga';
import locationSaga from './location.saga';
import loginSaga from './login.saga';
import mapItemSaga from './mapItemSaga';
import packingListSaga from './packingList.saga';
import registrationSaga from './registration.saga';
import tripsSaga from './trip.saga';
import userSaga from './user.saga';
import userItems from './userItems.saga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga
// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    tripsSaga(),
    itinerarySaga(),
    packingListSaga(),
    userItems(),
    mapItemSaga(),
    locationSaga(),
    collaboratorsSaga(),
    categorySaga(),
    checklistSaga(),
    itineraryMapItemsSaga(),
  ]);
}
