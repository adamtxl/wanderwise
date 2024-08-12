const initialState = {
    collaborators: [],
    nonCollaborators: []
};

const collaboratorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_COLLABORATORS':
            return { ...state, collaborators: action.payload };
        case 'SET_NON_COLLABORATORS':
            return { ...state, nonCollaborators: action.payload };
        default:
            return state;
    }
};

export default collaboratorsReducer;