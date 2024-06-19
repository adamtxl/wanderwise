const packingList = (state = [], action) => {
    switch (action.type) {
        case 'SET_PACKING_LIST':
            return action.payload;
        default:
            return state;
    }
};

export default packingList;