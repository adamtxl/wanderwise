import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import './Checklist.css';

const ChecklistComponent = () => {
  const { tripId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checklist = useSelector((state) => state.checklistReducer || []);

  const [newItem, setNewItem] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    dispatch({ type: 'FETCH_CHECKLIST', payload: tripId });
  }, [dispatch, tripId]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      dispatch({
        type: 'ADD_CHECKLIST_ITEM',
        payload: { trip_id: tripId, item_name: newItem, completed: false },
      });
      setNewItem('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddItem();
  };

  const handleToggleComplete = (item) => {
    dispatch({
      type: 'UPDATE_CHECKLIST_ITEM',
      payload: {
        checklistId: item.checklist_id,
        updatedItem: { item_name: item.item_name, completed: !item.completed, trip_id: tripId },
      },
    });
  };

  const handleDeleteItem = (checklistId) => {
    dispatch({ type: 'DELETE_CHECKLIST_ITEM', payload: checklistId, trip_id: tripId });
  };

  const handleSaveEdit = (checklistId) => {
    if (editedName.trim()) {
      dispatch({
        type: 'UPDATE_CHECKLIST_ITEM',
        payload: { checklistId, updatedItem: { item_name: editedName, trip_id: tripId } },
      });
      setEditItemId(null);
    }
  };

  const completed = checklist.filter((i) => i.completed);
  const pending = checklist.filter((i) => !i.completed);
  const progress = checklist.length ? Math.round((completed.length / checklist.length) * 100) : 0;

  return (
    <div className="cl-wrapper">
      {/* Header */}
      <div className="cl-header">
        <div>
          <div className="cl-eyebrow">Pre-Departure</div>
          <h1 className="cl-title">Trip Checklist</h1>
        </div>
        <button className="btn-cl-ghost" onClick={() => navigate(`/trip-details/${tripId}`)}>
          ← Back to Trip
        </button>
      </div>

      {/* Progress */}
      {checklist.length > 0 && (
        <div className="cl-progress-card">
          <div className="cl-progress-meta">
            <span className="cl-progress-label">{completed.length} of {checklist.length} complete</span>
            <span className="cl-progress-pct">{progress}%</span>
          </div>
          <div className="cl-progress-bar">
            <div className="cl-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Add item */}
      <div className="cl-add-row">
        <input
          className="cl-input"
          type="text"
          placeholder="Add a task..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-cl-primary" onClick={handleAddItem} disabled={!newItem.trim()}>
          + Add
        </button>
      </div>

      {/* List */}
      {checklist.length === 0 ? (
        <div className="cl-empty">
          <div className="cl-empty-icon">✅</div>
          <div className="cl-empty-heading">No tasks yet</div>
          <p className="cl-empty-text">Add your pre-departure tasks above.</p>
        </div>
      ) : (
        <div className="cl-list">
          {/* Pending */}
          {pending.length > 0 && (
            <div className="cl-section">
              <div className="cl-section-label">To Do · {pending.length}</div>
              {pending.map((item) => (
                <div key={item.checklist_id} className="cl-item">
                  <button className="cl-checkbox" onClick={() => handleToggleComplete(item)}>
                    <span className="cl-checkbox-inner" />
                  </button>
                  {editItemId === item.checklist_id ? (
                    <input
                      className="cl-edit-input"
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item.checklist_id)}
                      autoFocus
                    />
                  ) : (
                    <span className="cl-item-name">{item.item_name}</span>
                  )}
                  <div className="cl-item-actions">
                    {editItemId === item.checklist_id ? (
                      <>
                        <button className="btn-cl-save" onClick={() => handleSaveEdit(item.checklist_id)}>Save</button>
                        <button className="btn-cl-cancel" onClick={() => setEditItemId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-cl-icon" onClick={() => { setEditItemId(item.checklist_id); setEditedName(item.item_name); }}>✎</button>
                        <button className="btn-cl-icon btn-cl-icon-danger" onClick={() => handleDeleteItem(item.checklist_id)}>✕</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="cl-section">
              <div className="cl-section-label cl-section-done">Done · {completed.length}</div>
              {completed.map((item) => (
                <div key={item.checklist_id} className="cl-item cl-item-done">
                  <button className="cl-checkbox cl-checkbox-done" onClick={() => handleToggleComplete(item)}>
                    <span className="cl-checkbox-check">✓</span>
                  </button>
                  <span className="cl-item-name cl-item-name-done">{item.item_name}</span>
                  <div className="cl-item-actions">
                    <button className="btn-cl-icon btn-cl-icon-danger" onClick={() => handleDeleteItem(item.checklist_id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChecklistComponent;
