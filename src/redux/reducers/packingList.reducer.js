const packingList = (state = [], action) => {
    console.log('Action:', action); // Add this line
    switch (action.type) {
        case 'SET_PACKING_LIST':
            return action.payload;
        default:
            return state;
    }
};
export default packingList;