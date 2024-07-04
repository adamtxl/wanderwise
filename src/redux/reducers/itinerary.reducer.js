const initialState = [];

const itineraryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ITINERARIES':
            // Assuming the action.payload is the object {success: true, data: Array, message: '...'}
            // Directly return the data array as the new state
            return action.payload.data;
        case 'DELETE_ITINERARY_SUCCESS':
            return state.filter(itinerary => itinerary.itinerary_id !== action.payload);
        default:
            return state;
    }
};

export default itineraryReducer;