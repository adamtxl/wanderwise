const initialState = {
    itineraries: [],
    itinerariesWithMapItems: [],
};

const itineraryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ITINERARIES':
            return { ...state, itineraries: action.payload.data || [] };
        case 'SET_ITINERARIES_WITH_MAP_ITEMS':
            return { ...state, itinerariesWithMapItems: action.payload.data || [] };
        case 'DELETE_ITINERARY_SUCCESS':
            return { ...state, itineraries: state.itineraries.filter(itinerary => itinerary.itinerary_id !== action.payload) };
        default:
            return state;
    }
};

export default itineraryReducer;

