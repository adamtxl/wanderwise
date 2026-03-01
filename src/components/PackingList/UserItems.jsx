import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './PackingList.css';

const UserItems = ({ userItems, handleAddToPackingList, handleDeleteUserItem, handleUpdateUserItem, addedItems }) => {
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({ item_name: '', category: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const packingList = useSelector((state) => state.packingList);

  useEffect(() => {
    const unique = [...new Set(userItems.map((i) => i.category))].sort();
    setCategories(unique);
  }, [userItems]);

  const handleSaveClick = () => {
    handleUpdateUserItem({ ...editItemData, item_id: editItemId });
    setEditItemId(null);
  };

  const filteredItems = selectedCategory === 'All'
    ? userItems
    : userItems.filter((i) => i.category === selectedCategory);

  const isOnList = (item) => packingList?.some((p) => p.item_name === item.item_name);

  return (
    <div className="ui-wrapper">
      {/* Category filter */}
      <div className="ui-filters">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            className={`ui-filter-btn ${selectedCategory === cat ? 'ui-filter-active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="pl-empty">
          <div className="pl-empty-icon">🗂️</div>
          <div className="pl-empty-heading">No items yet</div>
          <p className="pl-empty-text">Add items in the "New Item" tab to build your library.</p>
        </div>
      ) : (
        <div className="ui-grid">
          {filteredItems.map((item) => {
            const onList = isOnList(item);
            return (
              <div key={item.item_id} className={`ui-card ${onList ? 'ui-card-added' : ''}`} data-cy="user-item">
                {editItemId === item.item_id ? (
                  <div className="ui-edit">
                    <input
                      className="pl-edit-input"
                      type="text"
                      value={editItemData.item_name}
                      onChange={(e) => setEditItemData({ ...editItemData, item_name: e.target.value })}
                      autoFocus
                    />
                    <input
                      className="pl-edit-input"
                      type="text"
                      value={editItemData.category}
                      onChange={(e) => setEditItemData({ ...editItemData, category: e.target.value })}
                    />
                    <div className="ui-edit-actions">
                      <button className="btn-pl-icon-save" onClick={handleSaveClick}>Save</button>
                      <button className="btn-pl-icon-cancel" onClick={() => setEditItemId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="ui-card-content">
                    <div className="ui-card-info">
                      <span className="ui-item-name">{item.item_name}</span>
                      <span className="ui-item-cat">{item.category}</span>
                    </div>
                    <div className="ui-card-actions">
                      {onList ? (
                        <span className="ui-added-badge">✓ Added</span>
                      ) : (
                        <button
                          className="btn-pl-add"
                          onClick={() => handleAddToPackingList(item)}
                          data-cy="add-to-packing-list-button"
                        >
                          + Add
                        </button>
                      )}
                      <button className="btn-pl-icon" onClick={() => { setEditItemId(item.item_id); setEditItemData({ item_name: item.item_name, category: item.category }); }}>✎</button>
                      <button className="btn-pl-icon btn-pl-icon-danger" onClick={() => handleDeleteUserItem(item.item_id)}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserItems;
