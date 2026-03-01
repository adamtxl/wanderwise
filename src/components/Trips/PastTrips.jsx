import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './PastTrips.css';

const PastTripsComponent = () => {
  const dispatch = useDispatch();
  const trips = useSelector((state) => state.trip.trips || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'FETCH_PAST_TRIPS' });
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const getCategoryIcon = (categoryId) => {
    const icons = {
      1: '🏖️', 2: '🏔️', 3: '🌆', 4: '🛣️',
      5: '🏜️', 6: '🌲', 7: '🌄', 8: '🏝️',
      9: '❄️', 10: '🗺️', 11: '🎢',
    };
    return icons[categoryId] || '✈️';
  };

  const getTripDuration = (start, end) => {
    const days = moment(end).diff(moment(start), 'days');
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="past-loading">
        <Spinner animation="border" style={{ color: '#c9a84c' }} />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="past-wrapper">
      <Container>
        {/* Header */}
        <div className="past-header">
          <div>
            <div className="past-eyebrow">Travel History</div>
            <h1 className="past-title">Past Adventures</h1>
            <p className="past-subtitle">
              {trips.length > 0
                ? `${trips.length} trip${trips.length !== 1 ? 's' : ''} completed`
                : 'Your travel history will appear here'}
            </p>
          </div>
          <button className="btn-past-primary" onClick={() => navigate('/edit-create-trips')}>
            + Plan Next Trip
          </button>
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="past-empty">
            <div className="past-empty-icon">🌍</div>
            <h2 className="past-empty-heading">No past trips yet</h2>
            <p className="past-empty-text">
              Your completed adventures will live here. Once a trip's end date passes,
              it moves from your trips page into your travel history.
            </p>
            <button className="btn-past-primary" onClick={() => navigate('/trips')}>
              View Upcoming Trips →
            </button>
          </div>
        )}

        {/* Trip cards */}
        {trips.length > 0 && (
          <Row>
            {trips.map((trip) => (
              <Col key={trip.trip_id} md={4} className="mb-4">
                <div className="past-card">
                  <div className="past-card-icon">{getCategoryIcon(trip.category_id)}</div>
                  <div className="past-card-title">{trip.trip_name}</div>
                  <div className="past-card-dates">
                    {moment(trip.start_date).format('MMM D')} – {moment(trip.end_date).format('MMM D, YYYY')}
                    <span className="past-card-duration">
                      · {getTripDuration(trip.start_date, trip.end_date)}
                    </span>
                  </div>
                  {trip.locales && (
                    <div className="past-card-location">📍 {trip.locales}</div>
                  )}
                  <button
                    className="btn-past-secondary"
                    onClick={() => navigate(`/trip-details/${trip.trip_id}`)}
                  >
                    View Details →
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default PastTripsComponent;
