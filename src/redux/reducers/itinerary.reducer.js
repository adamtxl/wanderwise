const initialState = [];

const itineraryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ITINERARIES':
            return action.payload;
        case 'DELETE_ITINERARY_SUCCESS':
            return state.filter(itinerary => itinerary.itinerary_id !== action.payload);
        default:
            return state;
    }
};

export default itineraryReducer;