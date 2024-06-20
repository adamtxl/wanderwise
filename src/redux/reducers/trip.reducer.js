const initialState = {
    trips: [], // Ensure this is an empty array initially
    loading: false,
    error: null,
};

const tripReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TRIPS':
            return { ...state, trips: action.payload, loading: false };
        // Other cases...
        default:
            return state;
    }
};

export default tripReducer;
