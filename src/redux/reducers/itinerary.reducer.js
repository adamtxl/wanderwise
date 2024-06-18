const itineraryReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ITINERARIES':
            return action.payload;
        default:
            return state;
    }
};

export default itineraryReducer;