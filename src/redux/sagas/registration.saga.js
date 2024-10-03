import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  try {
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });

    // Send registration request to the backend
    yield axios.post('/api/user/register', action.payload);

    // On successful registration, automatically log in
    yield put({ type: 'LOGIN', payload: action.payload });

    // Dispatch success action
    yield put({ type: 'REGISTRATION_SUCCESS' });
  } catch (error) {
    console.log('Error with user registration:', error);

    if (error.response && error.response.status === 409) {
      // Handle duplicate username error
      yield put({ type: 'REGISTRATION_FAILED_DUPLICATE' });
    } else {
      // General failure
      yield put({ type: 'REGISTRATION_FAILED' });
    }
  }
}

function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
}

export default registrationSaga;