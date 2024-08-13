const initialState = {
    trips: [], 
    loading: false,
    error: null,
};

const tripReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TRIPS':
            return { ...state, trips: action.payload, loading: false };
        default:
            return state;
    }
};

export default tripReducer;
