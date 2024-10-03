import { combineReducers } from 'redux';

// loginMessage holds the string that will display
// on the login screen if there's an error
const loginMessage = (state = '', action) => {
  switch (action.type) {
    case 'CLEAR_LOGIN_ERROR':
      return '';
    case 'LOGIN_INPUT_ERROR':
      return 'Enter your username and password!';
    case 'LOGIN_FAILED':
      return "Oops! The username and password didn't match an existing user. Register or try again!";
    case 'LOGIN_FAILED_NO_CODE':
      return 'Oops! Something went wrong! Is the server running?';
    case 'LOGIN_FAILED_USERNAME_REQUIRED':
      return 'Username is required.';
    case 'LOGIN_FAILED_PASSWORD_REQUIRED':
      return 'Password is required.';
    default:
      return state;
  }
};

// registrationMessage holds the string that will display
// on the registration screen if there's an error
const registrationMessage = (state = '', action) => {
  switch (action.type) {
    case 'CLEAR_REGISTRATION_ERROR':
      return '';
    case 'REGISTRATION_SUCCESS':
      return 'Registration successful!'; // Not really used, but you could add a message.
    case 'REGISTRATION_FAILED_DUPLICATE':
      return 'Username already exists. Please choose another one.';
    case 'REGISTRATION_FAILED':
      return 'Oops! Something went wrong. Please try again.';
    default:
      return state;
  }
};

// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage
export default combineReducers({
  loginMessage,
  registrationMessage,
});
