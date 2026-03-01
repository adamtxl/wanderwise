import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const PackingListItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const { tripId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    e.stopPropagation();
    setEditedItem({ ...editedItem, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    dispatch({ type: 'UPDATE_PACKING_LIST_ITEM', payload: editedItem, tripId });
    setEditMode(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_PACKING_LIST_ITEM', payload: item, tripId });
  };

  const handleTogglePacked = () => {
    dispatch({ type: 'UPDATE_PACKING_LIST_ITEM', payload: { ...item, packed: !item.packed }, tripId });
  };

  return (
    <div
      className={`pl-item ${item.packed ? 'pl-item-packed' : ''}`}
      onClick={!editMode ? handleTogglePacked : undefined}
      data-cy="packing-item"
    >
      <div className="pl-item-check">
        {item.packed ? <span className="pl-check-done">✓</span> : <span className="pl-check-empty" />}
      </div>

      {editMode ? (
        <div className="pl-item-edit" onClick={(e) => e.stopPropagation()}>
          <input
            className="pl-edit-input"
            type="text"
            name="item_name"
            value={editedItem.item_name}
            onChange={handleInputChange}
            autoFocus
          />
          <input
            className="pl-edit-input pl-edit-qty"
            type="number"
            name="quantity"
            value={editedItem.quantity}
            onChange={handleInputChange}
            min="1"
          />
        </div>
      ) : (
        <div className="pl-item-content">
          <span className="pl-item-name">{item.item_name}</span>
          {item.quantity > 1 && <span className="pl-item-qty">×{item.quantity}</span>}
        </div>
      )}

      <div className="pl-item-actions" onClick={(e) => e.stopPropagation()}>
        {editMode ? (
          <>
            <button className="btn-pl-icon-save" onClick={handleUpdate}>Save</button>
            <button className="btn-pl-icon-cancel" onClick={() => setEditMode(false)}>✕</button>
          </>
        ) : (
          <>
            <button className="btn-pl-icon" onClick={(e) => { e.stopPropagation(); setEditMode(true); setEditedItem({ ...item }); }}>✎</button>
            <button className="btn-pl-icon btn-pl-icon-danger" onClick={handleDelete}>✕</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PackingListItemCard;
