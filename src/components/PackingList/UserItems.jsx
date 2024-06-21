import React, { useState } from 'react';

const UserItems = ({ userItems, handleAddToPackingList, handleDeleteUserItem, handleUpdateUserItem }) => {
    const [editItemId, setEditItemId] = useState(null);
    const [editItemData, setEditItemData] = useState({ item_name: '', category: '' });

    const handleEditClick = (item) => {
        setEditItemId(item.item_id);
        setEditItemData({ item_name: item.item_name, category: item.category });
    };

    const handleSaveClick = () => {
        handleUpdateUserItem({ ...editItemData, item_id: editItemId });
        setEditItemId(null);
        setEditItemData({ item_name: '', category: '' });
    };

    return (
        <div>
            <h2>Items</h2>
            <ul>
                {userItems.map((item) => (
                    <li key={item.item_id}>
                        {editItemId === item.item_id ? (
                            <>
                                <input
                                    type="text"
                                    value={editItemData.item_name}
                                    onChange={(e) => setEditItemData({ ...editItemData, item_name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editItemData.category}
                                    onChange={(e) => setEditItemData({ ...editItemData, category: e.target.value })}
                                />
                                <button onClick={handleSaveClick}>Save</button>
                                <button onClick={() => setEditItemId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {item.item_name} ({item.category}){' '}
                                <button onClick={() => handleAddToPackingList(item)}>Add to Packing List</button>
                                <button onClick={() => handleDeleteUserItem(item.item_id)}>Delete</button>
                                <button onClick={() => handleEditClick(item)}>Edit</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserItems;
