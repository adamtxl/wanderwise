const defaultState = {
   currentItem: null,
   items: []
}
const mapItemReducer = (state = defaultState, action) => {
   if (action.type === 'SET_MAP_ITEMS') {
     // clear uploads and set to a new list (action.payload)
     return {
        ...state,
        items: action.payload
     }
   } else if (action.type === 'ADD_MAP_ITEM') {
      return {
         ...state,
         items: [...state.items, action.payload]
      }
   } else if (action.type === 'SET_CURRENT_ITEM') {
      return {
         ...state,
         currentItem: action.payload
      }
   }
   return state;
 };
 
 // uploads will be on the redux state at:
 // state.mapItems
 export default mapItemReducer;
 