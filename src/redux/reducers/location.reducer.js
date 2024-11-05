const initialState = {
    locations: [],
    loading: false,
    error: null,
  };
  
  const locationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_LOCATIONS':
        return {
          ...state,
          loading: true,
        };
        case 'SET_LOCATIONS':
          return {
              ...state,
              locations: action.payload,
              loading: false,
          };
      case 'LOCATIONS_ERROR':
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };
  
  export default locationReducer;