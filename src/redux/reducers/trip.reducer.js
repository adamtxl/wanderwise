const tripsReducer = (state = [], action) => {
    console.log('Reducer: Action received:', action);
    switch (action.type) {
        case 'SET_TRIPS':
            console.log('Reducer: Setting trips:', action.payload);
            return action.payload;
        default:
            return state;
    }
};

export default tripsReducer;
