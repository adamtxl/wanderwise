const initialState = {
    categories: [], 
    loading: false,
    error: null,
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload, loading: false };
        default:
            return state;
    }
};

export default categoryReducer;