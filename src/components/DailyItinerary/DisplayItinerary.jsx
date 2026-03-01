import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './itinerary.css';

const DisplayItineraries = ({ onSelectItinerary, selectedItinerary, onSaveItinerary, trip_id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxItineraries = useSelector((state) => state.itineraries.itineraries);
  const itinerariesArray = Array.isArray(reduxItineraries) ? reduxItineraries : [];

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const uniqueItineraries = itinerariesArray
    .reduce((acc, item) => {
      const found = acc.find((i) => i.itinerary_id === item.itinerary_id);
      if (!found) acc.push(item);
      return acc;
    }, [])
    .sort((a, b) => moment(a.day).diff(moment(b.day))); // Sort chronologically

  useEffect(() => {
    if (trip_id) {
      dispatch({ type: 'FETCH_ITINERARIES', payload: trip_id });
    }
  }, [trip_id, dispatch]);

  const handleItineraryChange = (e) => {
    onSelectItinerary({ ...selectedItinerary, [e.target.name]: e.target.value });
  };

  const handleDeleteItinerary = (itineraryId) => {
    dispatch({ type: 'DELETE_ITINERARY', payload: { itineraryId, tripId: trip_id } });
    setDeleteConfirmId(null);
  };

  return (
    <div className="di-wrapper">
      <div className="di-header">
        <div className="di-header-left">
          <div className="di-label">Daily Itineraries</div>
          {uniqueItineraries.length > 0 && (
            <span className="di-count">{uniqueItineraries.length} day{uniqueItineraries.length !== 1 ? 's' : ''} planned</span>
          )}
        </div>
        <button
          className="btn-di-primary"
          onClick={() => navigate(`/create-daily-itinerary/${trip_id}`)}
        >
          + Add Day
        </button>
      </div>

      {uniqueItineraries.length === 0 ? (
        <div className="di-empty">
          <div className="di-empty-icon">📅</div>
          <div className="di-empty-heading">No days planned yet</div>
          <p className="di-empty-text">Add your first day to start building your itinerary.</p>
          <button
            className="btn-di-primary"
            onClick={() => navigate(`/create-daily-itinerary/${trip_id}`)}
          >
            Plan Your First Day →
          </button>
        </div>
      ) : (
        <div className="di-grid">
          {uniqueItineraries.map((itinerary, index) => (
            <div
              key={itinerary.itinerary_id}
              className={`di-card ${selectedItinerary?.itinerary_id === itinerary.itinerary_id ? 'di-card-editing' : ''}`}
              data-cy="itinerary-item"
            >
              {selectedItinerary?.itinerary_id === itinerary.itinerary_id ? (
                /* ── Edit mode ── */
                <div className="di-edit">
                  <div className="di-edit-title">Editing Day</div>
                  <div className="di-edit-fields">
                    <div className="di-field">
                      <label>Day</label>
                      <input type="date" name="day"
                        value={moment(selectedItinerary.day).format('YYYY-MM-DD')}
                        onChange={handleItineraryChange} />
                    </div>
                    <div className="di-field">
                      <label>Location</label>
                      <input type="text" name="location"
                        value={selectedItinerary.location}
                        onChange={handleItineraryChange} />
                    </div>
                    <div className="di-field">
                      <label>Activity</label>
                      <input type="text" name="activity"
                        value={selectedItinerary.activity}
                        onChange={handleItineraryChange} />
                    </div>
                    <div className="di-field">
                      <label>Notes</label>
                      <textarea name="notes" rows={2}
                        value={selectedItinerary.notes}
                        onChange={handleItineraryChange} />
                    </div>
                  </div>
                  <div className="di-edit-actions">
                    <button className="btn-di-save" onClick={() => onSaveItinerary(selectedItinerary)}>Save</button>
                    <button className="btn-di-ghost" onClick={() => onSelectItinerary(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div className="di-view">
                  <div className="di-day-badge">Day {index + 1}</div>
                  <div className="di-date">{moment(itinerary.day).format('MMMM D, YYYY')}</div>
                  {itinerary.location && (
                    <div className="di-location">📍 {itinerary.location}</div>
                  )}
                  {itinerary.activity && (
                    <div className="di-detail">
                      <span className="di-detail-label">Activity</span>
                      <span className="di-detail-value">{itinerary.activity}</span>
                    </div>
                  )}
                  {itinerary.notes && (
                    <div className="di-detail">
                      <span className="di-detail-label">Notes</span>
                      <span className="di-detail-value di-notes">{itinerary.notes}</span>
                    </div>
                  )}
                  <div className="di-card-actions">
                    {deleteConfirmId === itinerary.itinerary_id ? (
                      <>
                        <span className="di-delete-confirm-text">Delete this day?</span>
                        <button className="btn-di-danger-sm" onClick={() => handleDeleteItinerary(itinerary.itinerary_id)}>Yes</button>
                        <button className="btn-di-ghost-sm" onClick={() => setDeleteConfirmId(null)}>No</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-di-ghost-sm" onClick={() => onSelectItinerary(itinerary)}>Edit</button>
                        <button className="btn-di-danger-sm" onClick={() => setDeleteConfirmId(itinerary.itinerary_id)}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayItineraries;
