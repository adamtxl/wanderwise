const userReducer = (state = { isAuthenticated: false, isAdmin: false }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...action.payload, // spread the user data into the state
        isAuthenticated: !!action.payload.id, // authenticated if user has an ID
        isAdmin: action.payload.admin 
      };
    case 'UNSET_USER':
      return { isAuthenticated: false, isAdmin: false };
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default userReducer;