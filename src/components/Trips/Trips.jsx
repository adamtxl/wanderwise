import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import './trips.css';

const TripsComponent = () => {
    const dispatch = useDispatch();
    const trips = useSelector((state) => state.trip.trips || []);
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                dispatch({ type: 'FETCH_TRIPS' });
                setError(null);
            } catch (error) {
                setError('Failed to fetch trips');
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [dispatch]);

    const calculateCountdown = (endDate) => {
        const now = moment();
        const end = moment(endDate);
        if (end.isBefore(now)) {
            return 'Your adventure has begun!';
        }
        const duration = moment.duration(end.diff(now));
        return `${duration.months()} months, ${duration.days()} days, ${duration.hours()} hours, and ${duration.minutes()} minutes`;
    };

    const isCollaborator = (trip) => {
        if (!user || !trip.user_id) {
            return false;
        }
        const collaborators = trip.collaborators || [];
        return collaborators.includes(user.id) && trip.user_id !== user.id;
    };

    if (loading) {
        return <Spinner animation='border' />;
    }

    if (error) {
        return <Alert variant='danger'>{error}</Alert>;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Button className='button-proceed' onClick={() => history.push('/past-trips')}>
                        View Past Trips
                    </Button>
                </Col>
                <Col className='mb-4 d-flex justify-content-center'>
                    <Button className='button-proceed' onClick={() => history.push('/create-trip')}>
                        Create New Trip
                    </Button>
                </Col>
            </Row>
            <Row>
                {trips.map((trip, index) => (
                    <Col key={trip.trip_id} md={4} className='mb-4'>
                        <Card className={index === 0 ? 'next-trip' : isCollaborator(trip) ? 'collaborator-trip' : 'bg-light'}>
                            <Card.Body>
                                <Card.Title>{trip.trip_name}</Card.Title>
                                <Card.Text>
                                    <strong>Start Date:</strong> {moment(trip.start_date).local().format('MM/DD/YYYY')}
                                    <br />
                                    <strong>End Date:</strong> {moment(trip.end_date).local().format('MM/DD/YYYY')}
                                    <br />
                                    <strong>Location:</strong> {trip.locales}
                                    <br />
                                    <strong>Destinations:</strong> {trip.map_locations}
                                    <br />
                                    <strong>Countdown:</strong> {calculateCountdown(trip.start_date)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TripsComponent;
