// Initial state
const initialState = [];

// Reducer function
const collaboratorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_COLLABORATORS':
            return action.payload;
        default:
            return state;
    }
};

export default collaboratorsReducer;