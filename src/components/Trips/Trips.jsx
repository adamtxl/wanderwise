import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './trips.css';

const TripsComponent = () => {
  const dispatch = useDispatch();
  const trips = useSelector((state) => state.trip.trips || []);
  const user = useSelector((state) => state.user);
  const categories = useSelector((state) => state.categoryReducer.categories || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        dispatch({ type: 'FETCH_TRIPS' });
        dispatch({ type: 'FETCH_CATEGORIES' });
        setError(null);
      } catch (error) {
        setError('Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [dispatch]);

  const calculateCountdown = (startDate) => {
    const now = moment();
    const start = moment(startDate);
    if (start.isBefore(now)) {
      return 'Your adventure has begun!';
    }
    const duration = moment.duration(start.diff(now));
    const months = Math.floor(duration.asMonths());
    const days = duration.days();
    if (months > 0) return `${months}mo ${days}d away`;
    if (days > 0) return `${days} days away`;
    return 'Tomorrow!';
  };

  const isCollaborator = (trip) => {
    const collaborators = trip.collaborators || [];
    if (!user || !trip.user_id) return false;
    return collaborators.includes(user.id) && trip.user_id !== user.id;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category ? category.category_name : 'Trip';
  };

  const getCategoryIcon = (categoryId) => {
    const icons = {
      1: '🏖️', 2: '🏔️', 3: '🌆', 4: '🛣️',
      5: '🏜️', 6: '🌲', 7: '🌄', 8: '🏝️',
      9: '❄️', 10: '🗺️', 11: '🎢',
    };
    return icons[categoryId] || '✈️';
  };

  if (loading) {
    return (
      <div className="trips-loading">
        <Spinner animation="border" style={{ color: '#c9a84c' }} />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="trips-wrapper">
      <Container>
        {/* Header row */}
        <div className="trips-header">
          <div>
            <h1 className="trips-title">Your Trips</h1>
            <p className="trips-subtitle">
              {trips.length > 0
                ? `${trips.length} adventure${trips.length > 1 ? 's' : ''} planned`
                : 'Where are you headed next?'}
            </p>
          </div>
          <div className="trips-header-actions">
            <Button className="btn-ww-secondary" onClick={() => navigate('/past-trips')}>
              Past Trips
            </Button>
            <Button className="btn-ww-primary" onClick={() => navigate('/edit-create-trips')}>
              + New Trip
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="trips-empty">
            <div className="trips-empty-icon">✦</div>
            <h2 className="trips-empty-heading">No trips planned yet</h2>
            <p className="trips-empty-text">
              Every great adventure starts with a plan. Create your first trip to get started —
              add your dates, build a day-by-day itinerary, map your destinations, and pack smarter.
            </p>
            <div className="trips-empty-steps">
              <div className="trips-empty-step">
                <span className="step-num">1</span>
                <span>Create a trip with your dates and destination</span>
              </div>
              <div className="trips-empty-step">
                <span className="step-num">2</span>
                <span>Build your daily itinerary and map your stops</span>
              </div>
              <div className="trips-empty-step">
                <span className="step-num">3</span>
                <span>Set up your packing list and invite collaborators</span>
              </div>
            </div>
            <Button className="btn-ww-primary btn-lg-ww" onClick={() => navigate('/edit-create-trips')}>
              Plan Your First Trip →
            </Button>
          </div>
        )}

        {/* Trip cards */}
        {trips.length > 0 && (
          <Row>
            {trips.map((trip, index) => {
              const isNext = index === 0;
              const isCollab = isCollaborator(trip);
              return (
                <Col key={trip.trip_id} md={4} className="mb-4">
                  <Card className={`ww-card ${isNext ? 'ww-card-next' : isCollab ? 'ww-card-collab' : ''}`}>
                    {isNext && <div className="ww-card-badge">Next Trip</div>}
                    {isCollab && <div className="ww-card-badge ww-badge-collab">Collaborating</div>}
                    <Card.Body>
                      <div className="ww-card-icon">{getCategoryIcon(trip.category_id)}</div>
                      <Card.Title className="ww-card-title">{trip.trip_name}</Card.Title>
                      <div className="ww-card-category">{getCategoryName(trip.category_id)}</div>
                      <div className="ww-card-details">
                        <div className="ww-card-detail">
                          <span className="detail-label">Dates</span>
                          <span className="detail-value">
                            {moment(trip.start_date).local().format('MMM D')} – {moment(trip.end_date).local().format('MMM D, YYYY')}
                          </span>
                        </div>
                        {trip.locales && (
                          <div className="ww-card-detail">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">{trip.locales}</span>
                          </div>
                        )}
                        <div className="ww-card-detail">
                          <span className="detail-label">Countdown</span>
                          <span className={`detail-value ${isNext ? 'detail-countdown' : ''}`}>
                            {calculateCountdown(trip.start_date)}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="btn-ww-primary btn-card"
                        onClick={() => navigate(`/trip-details/${trip.trip_id}`)}
                      >
                        View Details →
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default TripsComponent;
