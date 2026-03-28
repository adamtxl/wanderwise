import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PackingListItemCard from './PackingListItemCard';
import UserItems from './UserItems';
import './PackingList.css';

const PackingList = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const packingList = useSelector((state) => state.packingList);
  const userItems = useSelector((state) => state.userItems);
  const [newItem, setNewItem] = useState({ item_name: '', category: '' });
  const [addedItems, setAddedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    if (tripId) dispatch({ type: 'FETCH_PACKING_LIST', payload: { tripId } });
    dispatch({ type: 'FETCH_USER_ITEMS' });
  }, [dispatch, tripId]);

  const handleAddUserItem = (e) => {
    e.preventDefault();
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    dispatch({
      type: 'ADD_USER_ITEM',
      payload: { ...newItem, category: capitalize(newItem.category) },
    });
    setNewItem({ item_name: '', category: '' });
  };

  const handleAddToPackingList = (item) => {
    dispatch({
      type: 'ADD_PACKING_LIST_ITEM',
      payload: { item_name: item.item_name, quantity: 1, packed: false, trip_id: tripId, packinglist_id: item.packinglist_id },
      tripId,
    });
    setAddedItems((prev) => [...prev, item.item_id]);
  };

  const handleDeleteUserItem = (itemId) => dispatch({ type: 'DELETE_USER_ITEM', payload: itemId });
  const handleUpdateUserItem = (item) => dispatch({ type: 'UPDATE_USER_ITEM', payload: item });

  const packed = packingList.filter((i) => i.packed);
  const unpacked = packingList.filter((i) => !i.packed);
  const progress = packingList.length ? Math.round((packed.length / packingList.length) * 100) : 0;

  return (
    <div className="pl-wrapper">
      {/* Header */}
      <div className="pl-header">
        <div>
          <div className="pl-eyebrow">🧳 Packing</div>
          <h1 className="pl-title">Packing List</h1>
        </div>
        <button className="btn-pl-ghost" onClick={() => navigate(`/trip-details/${tripId}`)}>
          ← Back to Trip
        </button>
      </div>

      {/* Progress */}
      {packingList.length > 0 && (
        <div className="pl-progress-card">
          <div className="pl-progress-meta">
            <span className="pl-progress-label">{packed.length} of {packingList.length} packed</span>
            <span className="pl-progress-pct">{progress}%</span>
          </div>
          <div className="pl-progress-bar">
            <div className="pl-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="pl-tabs">
        <button className={`pl-tab ${activeTab === 'list' ? 'pl-tab-active' : ''}`} onClick={() => setActiveTab('list')}>
          📋 My List {packingList.length > 0 && <span className="pl-tab-count">{packingList.length}</span>}
        </button>
        <button className={`pl-tab ${activeTab === 'items' ? 'pl-tab-active' : ''}`} onClick={() => setActiveTab('items')}>
          🗂️ Item Library {userItems.length > 0 && <span className="pl-tab-count">{userItems.length}</span>}
        </button>
        <button className={`pl-tab ${activeTab === 'add' ? 'pl-tab-active' : ''}`} onClick={() => setActiveTab('add')}>
          + New Item
        </button>
      </div>

      {/* Packing list tab */}
      {activeTab === 'list' && (
        <div className="pl-section">
          {packingList.length === 0 ? (
            <div className="pl-empty">
              <div className="pl-empty-icon">🧳</div>
              <div className="pl-empty-heading">Nothing packed yet</div>
              <p className="pl-empty-text">Add items from your library or create new ones.</p>
              <button className="btn-pl-primary" onClick={() => setActiveTab('items')}>Browse Item Library →</button>
            </div>
          ) : (
            <>
              {unpacked.length > 0 && (
                <div className="pl-group">
                  <div className="pl-group-label">To Pack · {unpacked.length}</div>
                  <div className="pl-group-items">
                    {unpacked.map((item) => (
                      <PackingListItemCard key={item.packinglist_id} item={item} />
                    ))}
                  </div>
                </div>
              )}
              {packed.length > 0 && (
                <div className="pl-group">
                  <div className="pl-group-label pl-group-label-done">Packed ✓ · {packed.length}</div>
                  <div className="pl-group-items">
                    {packed.map((item) => (
                      <PackingListItemCard key={item.packinglist_id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Item library tab */}
      {activeTab === 'items' && (
        <UserItems
          userItems={userItems}
          handleAddToPackingList={handleAddToPackingList}
          handleDeleteUserItem={handleDeleteUserItem}
          handleUpdateUserItem={handleUpdateUserItem}
          addedItems={addedItems}
        />
      )}

      {/* Add new item tab */}
      {activeTab === 'add' && (
        <div className="pl-section">
          <div className="pl-card">
            <div className="pl-card-label">Add to Item Library</div>
            <p className="pl-card-sub">Items saved here are available across all your trips.</p>
            <form onSubmit={handleAddUserItem} className="pl-add-form">
              <div className="pl-field">
                <label>Item Name</label>
                <input
                  type="text"
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  placeholder="e.g. Sunscreen"
                  required
                />
              </div>
              <div className="pl-field">
                <label>Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="e.g. Toiletries"
                  required
                />
              </div>
              <button type="submit" className="btn-pl-primary" data-cy="add_item">
                + Save to Library
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingList;
