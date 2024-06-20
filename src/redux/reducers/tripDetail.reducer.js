const initialState = {
    currentTrip: null,
    loading: false,
    error: null,
};

const tripDetailReducer = (state = initialState, action) => {
    console.log('action', action); // Log the action

    switch (action.type) {
        case 'SET_TRIP_BY_ID':
            console.log('prev state', state); // Log the state before it's updated

            const newState = {
                ...state,
                currentTrip: action.payload,
            };

            console.log('new state', newState); // Log the state after it's updated

            return newState;
        // other cases...
        default:
            return state;
    }
};

export default tripDetailReducer;
