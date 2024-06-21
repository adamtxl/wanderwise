import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PackingListItemCard from './PackingListItemCard';

const PackingList = () => {
    const { tripId } = useParams();
    const dispatch = useDispatch();
    const packingList = useSelector((state) => state.packingList);
    const userItems = useSelector((state) => state.userItems);
    const [newItem, setNewItem] = useState({ item_name: '', category: '' });

    useEffect(() => {
        if (tripId) {
            dispatch({ type: 'FETCH_PACKING_LIST', payload: { tripId } });
        }
        dispatch({ type: 'FETCH_USER_ITEMS' });
    }, [dispatch, tripId]);

    const handleAddUserItem = () => {
        dispatch({
            type: 'ADD_USER_ITEM',
            payload: newItem,
        });
        setNewItem({ item_name: '', category: '' });
    };

    const handleAddToPackingList = (item) => {
        const packingListItem = {
            item_name: item.item_name,
            quantity: 1,
            packed: false,
            trip_id: tripId, // Ensure tripId is included in the payload
            packinglist_id: item.packinglist_id // Ensure packinglist_id is included in the payload
        };
        dispatch({ type: 'ADD_PACKING_LIST_ITEM', payload: packingListItem });
    };

    const handleUpdateItem = (item) => {
        dispatch({ type: 'UPDATE_PACKING_LIST_ITEM', payload: item });
    };

    const handleDeleteItem = (packinglist_id) => {
        dispatch({ type: 'DELETE_PACKING_LIST_ITEM', payload: { packinglist_id, tripId } });
    };
    
    return (
        <div>
            <h2>Packing List</h2>
            <div>
                {packingList.map((item) => (
                    <PackingListItemCard key={item.packinglist_id} item={item} />
                ))}
            </div>
            <h2>Items</h2>
            <ul>
                {userItems.map((item) => (
                    <li key={item.item_id}>
                        {item.item_name} ({item.category}){' '}
                        <button onClick={() => handleAddToPackingList(item)}>Add to Packing List</button>
                    </li>
                ))}
            </ul>
            <h2>Add New Item</h2>
            <input
                type='text'
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                placeholder='Item Name'
            />
            <input
                type='text'
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                placeholder='Category'
            />
            <button onClick={handleAddUserItem}>Add Item</button>
        </div>
    );
};

export default PackingList;


