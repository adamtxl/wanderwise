const initialState = [];

const checklistReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CHECKLIST':
            return action.payload;
        
        case 'ADD_CHECKLIST_ITEM':
            return [...state, action.payload];
        
        case 'UPDATE_CHECKLIST_ITEM':
            return state.map((item) =>
                item.checklist_id === action.payload.itemId
                    ? { ...item, ...action.payload.updatedItem }
                    : item
            );

        case 'DELETE_CHECKLIST_ITEM':
            return state.filter(item => item.checklist_id !== action.payload);

        default:
            return state;
    }
};

export default checklistReducer;