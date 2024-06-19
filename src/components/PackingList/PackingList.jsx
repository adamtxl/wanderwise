import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const PackingList = () => {
    const { tripId, itineraryId } = useParams();
    const dispatch = useDispatch();
    const packingList = useSelector(state => state.packingList);
    const userItems = useSelector(state => state.userItems);
    const [newItem, setNewItem] = useState({ name: '', category: '' });

    useEffect(() => {
        if (tripId && itineraryId) {
            dispatch({ type: 'FETCH_PACKING_LIST', payload: { tripId, itineraryId } });
        }
        dispatch({ type: 'FETCH_USER_ITEMS' });
    }, [dispatch, tripId, itineraryId]);
    const handleAddUserItem = () => {
        dispatch({
            type: 'ADD_USER_ITEM',
            payload: newItem
        });
        setNewItem({ name: '', category: '' });
    };

    const handleAddToPackingList = (item) => {
        const packingListItem = {
            itinerary_id: itineraryId,
            item_name: item.item_name,
            quantity: 1,
            packed: false,
            tripId: tripId // Ensure tripId is included in the payload
        };
        dispatch({ type: 'ADD_PACKING_LIST_ITEM', payload: packingListItem});
    };

    return (
        <div>
            <h2>Packing List</h2>
            <ul>
                {packingList.map(item => (
                    <li key={item.item_id}>
                        {item.item_name} - Quantity: {item.quantity} - Packed: {item.packed ? 'Yes' : 'No'}
                    </li>
                ))}
            </ul>
            <h2>Items</h2>
            <ul>
                {userItems.map(item => (
                    <li key={item.item_id}>
                        {item.item_name} ({item.category}) <button onClick={() => handleAddToPackingList(item)}>Add to Packing List</button>
                    </li>
                ))}
            </ul>
            <h2>Add New Item</h2>
            <input
                type="text"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item Name"
            />
            <input
                type="text"
                value={newItem.category}
                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                placeholder="Category"
            />
            <button onClick={handleAddUserItem}>Add Item</button>
        </div>
    );
};

export default PackingList;
