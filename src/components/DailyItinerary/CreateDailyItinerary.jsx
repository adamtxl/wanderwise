import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Map from '../Maps/Map';
import './itinerary.css';
import moment from 'moment';

const CreateDailyItinerary = ({ getCursor: getCursorProp }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const trip = useSelector((state) => state.tripDetailReducer.currentTrip?.data);
  const mapItems = useSelector((state) => state.mapItems.items);

  const [itinerary, setItinerary] = useState({
    day: '',
    location: '',
    latitude: '39.5',
    longitude: '-98.35',
    activity: '',
    notes: '',
  });

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    dispatch({ type: 'FETCH_MAP_ITEMS' });
    dispatch({ type: 'FETCH_TRIP_BY_ID', payload: tripId });
  }, [dispatch, tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch({
        type: 'ADD_ITINERARY',
        payload: { itinerary, tripId },
      });
      const newItineraryId = response?.data?.id;
      if (newItineraryId && itinerary.map_item_id) {
        dispatch({
          type: 'ADD_ITINERARY_MAP_ITEM',
          payload: { itinerary_id: newItineraryId, map_item_id: itinerary.map_item_id },
        });
      }
      navigate(`/trip-details/${tripId}`);
    } catch (err) {
      console.error('Error creating itinerary:', err);
    }
  };

  const handleMarkerClick = (item) => {
    setItinerary((prev) => ({
      ...prev,
      location: item.title,
      latitude: item.latitude,
      longitude: item.longitude,
      description: item.description || prev.description,
      map_item_id: item.id,
    }));
  };

  const cursorFn = getCursorProp ?? ((state) => {
    if (state?.isDragging) return 'grabbing';
    if (state?.isHovering) return 'pointer';
    return 'grab';
  });

  const tripStartDate = trip ? moment(trip.start_date).format('YYYY-MM-DD') : '';
  const tripEndDate = trip ? moment(trip.end_date).format('YYYY-MM-DD') : '';

  return (
    <div className="ci-wrapper">

      {/* Header */}
      <div className="ci-header">
        <div>
          <div className="ci-eyebrow">
            {trip?.trip_name || 'Trip'}
          </div>
          <h1 className="ci-title">Add a Day</h1>
          <p className="ci-subtitle">
            Click a map pin to auto-fill location, or enter details manually.
          </p>
        </div>
        <button className="btn-ci-ghost" onClick={() => navigate(`/trip-details/${tripId}`)}>
          ← Back to Trip
        </button>
      </div>

      {/* Two column layout */}
      <div className="ci-body">

        {/* Form */}
        <div className="ci-form-panel">
          <form onSubmit={handleSubmit} className="ci-form">

            <div className="ci-field">
              <label>Date</label>
              <input
                type="date"
                name="day"
                value={itinerary.day}
                onChange={handleInputChange}
                min={tripStartDate}
                max={tripEndDate}
                required
              />
              {tripStartDate && (
                <span className="ci-field-hint">
                  {moment(tripStartDate).format('MMM D')} – {moment(tripEndDate).format('MMM D, YYYY')}
                </span>
              )}
            </div>

            <div className="ci-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={itinerary.location}
                onChange={handleInputChange}
                placeholder="e.g. Juneau, AK or click a map pin"
              />
            </div>

            <div className="ci-field">
              <label>Activity</label>
              <input
                type="text"
                name="activity"
                value={itinerary.activity}
                onChange={handleInputChange}
                placeholder="e.g. Whale watching tour"
              />
            </div>

            <div className="ci-field">
              <label>Notes</label>
              <textarea
                name="notes"
                rows={4}
                value={itinerary.notes}
                onChange={handleInputChange}
                placeholder="Reservations, reminders, packing notes..."
              />
            </div>

            {itinerary.location && (
              <div className="ci-selected-pin">
                <span className="ci-pin-icon">📍</span>
                <span className="ci-pin-label">Pin selected: <strong>{itinerary.location}</strong></span>
              </div>
            )}

            <div className="ci-form-actions">
              <button type="submit" className="btn-ci-primary">Save Day →</button>
              <button type="button" className="btn-ci-ghost" onClick={() => navigate(`/trip-details/${tripId}`)}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Map */}
        <div className="ci-map-panel">
          <div className="ci-map-label">Click a pin to select a location</div>
          <div className="ci-map-container">
            <Map
              mapStyle="mapbox://styles/mapbox/streets-v11"
              style={{ width: '100%', height: '100%' }}
              mapboxAccessToken={MAPBOX_TOKEN}
              getCursor={cursorFn}
              touchAction="pan-y"
              dragPan={true}
              dragRotate={false}
              markers={mapItems}
              onItemClick={handleMarkerClick}
              initialViewState={{ latitude: 39.5, longitude: -98.35, zoom: 3.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDailyItinerary;
