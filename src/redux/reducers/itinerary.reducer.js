const initialState = [];

const itineraryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ITINERARIES':
            // Ensure the state is updated with the array from the action's payload.data
            return action.payload.data;
        case 'DELETE_ITINERARY_SUCCESS':
            return state.filter(itinerary => itinerary.itinerary_id !== action.payload);
        default:
            return state;
    }
};

export default itineraryReducer;