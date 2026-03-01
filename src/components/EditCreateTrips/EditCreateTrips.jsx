import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import './EditCreateTrips.css';

const getCategoryIcon = (id) => {
  const icons = { 1:'🏖️', 2:'🏔️', 3:'🌆', 4:'🛣️', 5:'🏜️', 6:'🌲', 7:'🌄', 8:'🏝️', 9:'❄️', 10:'🗺️', 11:'🎢' };
  return icons[id] || '✈️';
};

const EditCreateTrips = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const trip = location.state?.trip || null;
  const isEditing = !!trip;

  const categories = useSelector((state) => state.categoryReducer.categories);

  const [editedTrip, setEditedTrip] = useState(trip || {
    trip_name: '', start_date: '', end_date: '',
    locales: '', map_locations: '', category_id: '',
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_CATEGORIES' });
  }, [dispatch]);

  const handleInputChange = (e) => {
    setEditedTrip({ ...editedTrip, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setEditedTrip({ ...editedTrip, category_id: e.target.value });
  };

  const handleSave = async () => {
    try {
      dispatch({ type: 'CREATE_TRIP', payload: editedTrip });
      navigate('/trips');
    } catch (err) {
      console.error('Error creating/updating trip:', err);
    }
  };

  const selectedCategory = categories.find((c) => String(c.category_id) === String(editedTrip.category_id));

  return (
    <div className="ect-wrapper">
      <div className="ect-header">
        <div>
          <div className="ect-eyebrow">{isEditing ? 'Edit Trip' : 'New Trip'}</div>
          <h1 className="ect-title">{isEditing ? editedTrip.trip_name || 'Edit Trip' : 'Plan a Trip'}</h1>
        </div>
        <button className="btn-ect-ghost" onClick={() => navigate('/trips')}>← Back</button>
      </div>

      <div className="ect-body">
        <div className="ect-form-panel">

          {/* Name */}
          <div className="ect-field">
            <label>Trip Name</label>
            <input
              type="text"
              name="trip_name"
              value={editedTrip.trip_name}
              onChange={handleInputChange}
              placeholder="e.g. Alaska Adventure 2026"
              required
            />
          </div>

          {/* Dates */}
          <div className="ect-row">
            <div className="ect-field">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={editedTrip.start_date ? moment(editedTrip.start_date).format('YYYY-MM-DD') : ''}
                onChange={handleInputChange}
                max={editedTrip.end_date || ''}
              />
            </div>
            <div className="ect-field">
              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={editedTrip.end_date ? moment(editedTrip.end_date).format('YYYY-MM-DD') : ''}
                onChange={handleInputChange}
                min={editedTrip.start_date || ''}
              />
            </div>
          </div>

          {editedTrip.start_date && editedTrip.end_date && (
            <div className="ect-duration">
              {moment(editedTrip.end_date).diff(moment(editedTrip.start_date), 'days')} day trip
            </div>
          )}

          {/* Location */}
          <div className="ect-field">
            <label>Location</label>
            <input
              type="text"
              name="locales"
              value={editedTrip.locales}
              onChange={handleInputChange}
              placeholder="e.g. Juneau, Alaska"
            />
          </div>

          {/* Destinations */}
          <div className="ect-field">
            <label>Destinations</label>
            <input
              type="text"
              name="map_locations"
              value={editedTrip.map_locations}
              onChange={handleInputChange}
              placeholder="e.g. Tracy Arm Fjord, Mendenhall Glacier"
            />
          </div>

          {/* Category */}
          <div className="ect-field">
            <label>Category</label>
            <div className="ect-category-select">
              <select value={editedTrip.category_id} onChange={handleCategoryChange}>
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {getCategoryIcon(cat.category_id)} {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category preview */}
          {selectedCategory && (
            <div className="ect-category-preview">
              <span className="ect-preview-icon">{getCategoryIcon(selectedCategory.category_id)}</span>
              <span className="ect-preview-name">{selectedCategory.category_name}</span>
              <span className="ect-preview-hint">Background will match this category</span>
            </div>
          )}

          <div className="ect-actions">
            <button className="btn-ect-primary" onClick={handleSave} disabled={!editedTrip.trip_name}>
              {isEditing ? 'Save Changes' : 'Create Trip'} →
            </button>
            <button className="btn-ect-ghost" onClick={() => navigate('/trips')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCreateTrips;
