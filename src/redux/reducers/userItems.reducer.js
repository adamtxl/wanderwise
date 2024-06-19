const userItems = (state = [], action) => {
    switch (action.type) {
        case 'SET_USER_ITEMS':
            return action.payload;
        default:
            return state;
    }
};

export default userItems;