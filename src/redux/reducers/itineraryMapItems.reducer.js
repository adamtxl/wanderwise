const initialState = {
    items: [],
};

const itineraryMapItemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ITINERARY_MAP_ITEMS':
            return { ...state, items: action.payload };
        default:
            return state;
    }
};

export default itineraryMapItemsReducer;