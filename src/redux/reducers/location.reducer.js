
const initialState = {
    locations: [],
    loading: false,
    error: null,
};

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LOCATIONS':
            return { ...state, locations: action.payload, loading: false };
        case 'FETCH_LOCATIONS':
            return { ...state, loading: true };
        case 'FETCH_LOCATIONS_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default locationReducer;
