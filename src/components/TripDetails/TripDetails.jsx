import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import TripMap from './TripMap';
import DisplayItineraries from '../DailyItinerary/DisplayItinerary';
import moment from 'moment';
import TripCollaborators from '../Collaborators/TripCollaborators';
import './TripDetails.css';

const getCategoryIcon = (id) => {
  const icons = {
    1: '🏖️', 2: '🏔️', 3: '🌆', 4: '🛣️',
    5: '🏜️', 6: '🌲', 7: '🌄', 8: '🏝️',
    9: '❄️', 10: '🗺️', 11: '🎢',
  };
  return icons[id] || '✈️';
};

const TripDetails = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tripId } = useParams();

  const trip = useSelector((state) => state.tripDetailReducer?.currentTrip?.data) || {
    trip_id: '', trip_name: '', start_date: '', end_date: '',
    locales: '', map_locations: '', category_id: '',
  };
  const categories = useSelector((state) => state.categoryReducer.categories);
  const reduxItineraries = useSelector((state) => state.itinerary) || [];

  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(trip);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (tripId) {
      dispatch({ type: 'FETCH_TRIP_BY_ID', payload: tripId });
      dispatch({ type: 'FETCH_CATEGORIES' });
      dispatch({ type: 'FETCH_ITINERARIES_WITH_MAP_ITEMS', payload: tripId });
    }
  }, [dispatch, tripId]);

  useEffect(() => {
    setEditedTrip({ ...trip });
  }, [trip.trip_id]);

  const categoryName = categories?.find((c) => c.category_id === trip.category_id)?.category_name || '';
  const tripDuration = trip.start_date && trip.end_date
    ? moment(trip.end_date).diff(moment(trip.start_date), 'days') + ' days'
    : '';
  const countdown = trip.start_date
    ? moment(trip.start_date).isAfter(moment())
      ? moment(trip.start_date).diff(moment(), 'days') + ' days away'
      : 'Underway'
    : '';

  const handleInputChange = (e) => setEditedTrip({ ...editedTrip, [e.target.name]: e.target.value });
  const handleCategoryChange = (e) => setEditedTrip({ ...editedTrip, category_id: Number(e.target.value) });

  const handleSaveClick = async () => {
    try {
      await dispatch({ type: 'UPDATE_TRIP', payload: editedTrip });
      setIsEditing(false);
      dispatch({ type: 'FETCH_TRIP_BY_ID', payload: editedTrip.trip_id });
    } catch (err) {
      console.error('Error updating trip:', err);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleDeleteConfirm = () => {
    dispatch({ type: 'DELETE_TRIP', payload: trip.trip_id });
    navigate('/trips');
  };

  const handleSelectItinerary = (itinerary) => setSelectedItinerary(itinerary);
  const handleSaveItinerary = (updated) => {
    dispatch({ type: 'UPDATE_ITINERARY', payload: updated });
    setSelectedItinerary(null);
  };
  const handleMarkerClick = (location) => {
    const match = reduxItineraries.find((i) => i.location === location.title);
    if (match) setSelectedItinerary(match);
  };

  return (
    <div className="td-wrapper">

      {/* ── Hero Header ── */}
      <div className="td-hero">
        <div className="td-hero-left">
          <div className="td-category-icon">{getCategoryIcon(trip.category_id)}</div>
          <div>
            <div className="td-eyebrow">{categoryName}</div>
            {isEditing ? (
              <input
                className="td-title-input"
                type="text"
                name="trip_name"
                value={editedTrip.trip_name}
                onChange={handleInputChange}
              />
            ) : (
              <h1 className="td-title">{trip.trip_name}</h1>
            )}
            <div className="td-meta">
              {trip.start_date && (
                <span>{moment(trip.start_date).format('MMM D')} – {moment(trip.end_date).format('MMM D, YYYY')}</span>
              )}
              {tripDuration && <span className="td-meta-sep">·</span>}
              {tripDuration && <span>{tripDuration}</span>}
              {countdown && <span className="td-meta-sep">·</span>}
              {countdown && <span className="td-countdown">{countdown}</span>}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="td-hero-actions">
          {isEditing ? (
            <>
              <button className="btn-td-primary" onClick={handleSaveClick}>Save Changes</button>
              <button className="btn-td-ghost" onClick={() => { setIsEditing(false); setEditedTrip({ ...trip }); }}>Cancel</button>
            </>
          ) : (
            <button className="btn-td-ghost" onClick={() => setIsEditing(true)}>✎ Edit Trip</button>
          )}
        </div>
      </div>

      {/* ── Main Body ── */}
      <div className="td-body">

        {/* Left col: Details + Nav + Collaborators */}
        <div className="td-left">

          {/* Trip details card */}
          <div className="td-card">
            <div className="td-card-label">Trip Details</div>
            {isEditing ? (
              <div className="td-edit-fields">
                <div className="td-field">
                  <label>Start Date</label>
                  <input type="date" name="start_date"
                    value={moment(editedTrip.start_date).format('YYYY-MM-DD')}
                    onChange={handleInputChange} />
                </div>
                <div className="td-field">
                  <label>End Date</label>
                  <input type="date" name="end_date"
                    value={moment(editedTrip.end_date).format('YYYY-MM-DD')}
                    onChange={handleInputChange} />
                </div>
                <div className="td-field">
                  <label>Location</label>
                  <input type="text" name="locales" value={editedTrip.locales} onChange={handleInputChange} placeholder="e.g. Juneau, Alaska" />
                </div>
                <div className="td-field">
                  <label>Map Locations</label>
                  <input type="text" name="map_locations" value={editedTrip.map_locations} onChange={handleInputChange} />
                </div>
                <div className="td-field">
                  <label>Category</label>
                  <select value={editedTrip.category_id} onChange={handleCategoryChange}>
                    <option value="">Select a category</option>
                    {categories?.map((c) => (
                      <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="td-details-grid">
                {trip.locales && (
                  <div className="td-detail">
                    <span className="td-detail-label">Location</span>
                    <span className="td-detail-value">{trip.locales}</span>
                  </div>
                )}
                {trip.map_locations && (
                  <div className="td-detail">
                    <span className="td-detail-label">Destinations</span>
                    <span className="td-detail-value">{trip.map_locations}</span>
                  </div>
                )}
                <div className="td-detail">
                  <span className="td-detail-label">Start</span>
                  <span className="td-detail-value">{moment(trip.start_date).format('MMMM D, YYYY')}</span>
                </div>
                <div className="td-detail">
                  <span className="td-detail-label">End</span>
                  <span className="td-detail-value">{moment(trip.end_date).format('MMMM D, YYYY')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation actions */}
          <div className="td-card">
            <div className="td-card-label">Plan Your Trip</div>
            <div className="td-nav-buttons">
              <button className="btn-td-nav" data-cy="daily-itinerary-button"
                onClick={() => navigate(`/create-daily-itinerary/${trip.trip_id}`)}>
                <span className="btn-td-nav-icon">📅</span>
                <div>
                  <div className="btn-td-nav-title">Daily Itinerary</div>
                  <div className="btn-td-nav-sub">Plan day by day</div>
                </div>
                <span className="btn-td-nav-arrow">→</span>
              </button>
              <button className="btn-td-nav" data-cy="packing-list-button"
                onClick={() => navigate(`/packing-list/${trip.trip_id}`)}>
                <span className="btn-td-nav-icon">🧳</span>
                <div>
                  <div className="btn-td-nav-title">Packing List</div>
                  <div className="btn-td-nav-sub">Track what you're bringing</div>
                </div>
                <span className="btn-td-nav-arrow">→</span>
              </button>
              <button className="btn-td-nav"
                onClick={() => navigate(`/checklist/${trip.trip_id}`)}>
                <span className="btn-td-nav-icon">✅</span>
                <div>
                  <div className="btn-td-nav-title">Trip Checklist</div>
                  <div className="btn-td-nav-sub">Pre-departure tasks</div>
                </div>
                <span className="btn-td-nav-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Collaborators */}
          <div className="td-card">
            <div className="td-card-label">Collaborators</div>
            <TripCollaborators trip_id={trip.trip_id} />
          </div>

          {/* Danger zone */}
          <div className="td-card td-danger-card">
            <div className="td-card-label td-danger-label">Danger Zone</div>
            <p className="td-danger-text">Deleting a trip removes all itineraries, packing lists, and data permanently.</p>
            <button className="btn-td-danger" onClick={handleDeleteClick}>Delete This Trip</button>
          </div>
        </div>

        {/* Right col: Map */}
        <div className="td-right">
          <div className="td-card td-map-card">
            <div className="td-card-label">Trip Map</div>
            <div className="td-map-container">
              <TripMap
                tripId={trip.trip_id}
                onMarkerClick={handleMarkerClick}
                height={820}
                getCursor={(state) => {
                  if (state?.isDragging) return 'grabbing';
                  if (state?.isHovering) return 'pointer';
                  return 'grab';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Itineraries — full width below ── */}
      <div className="td-itineraries">
        <div className="td-card">
          <DisplayItineraries
            trip_id={trip.trip_id}
            onSelectItinerary={handleSelectItinerary}
            selectedItinerary={selectedItinerary}
            onSaveItinerary={handleSaveItinerary}
          />
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="td-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="td-modal" onClick={(e) => e.stopPropagation()}>
            <div className="td-modal-icon">⚠️</div>
            <h2 className="td-modal-title">Delete "{trip.trip_name}"?</h2>
            <p className="td-modal-text">
              This will permanently delete the trip and all associated itineraries, packing lists, and data. This cannot be undone.
            </p>
            <div className="td-modal-actions">
              <button className="btn-td-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-td-danger" onClick={handleDeleteConfirm}>Yes, Delete Trip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStoreToProps = (store) => ({
  itineraries: store.itinerary,
});

export default connect(mapStoreToProps)(TripDetails);
