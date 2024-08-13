const initialState = [];

const itineraryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ITINERARIES':
            // Check if action.payload.data exists and is an array, otherwise return the current state
            if (Array.isArray(action.payload.data)) {
                return action.payload.data;
            } else {
                console.error('SET_ITINERARIES action payload is missing data or data is not an array', action.payload);
                return state; // Return the current state to avoid returning undefined
            }
        case 'DELETE_ITINERARY_SUCCESS':
            return state.filter(itinerary => itinerary.itinerary_id !== action.payload);
        default:
            return state;
    }
};

export default itineraryReducer;