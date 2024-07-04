import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';

const TripsComponent = () => {
    const dispatch = useDispatch();
    const trips = useSelector((state) => state.trip.trips || []); // Default to an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

	useEffect(() => {
		const fetchTrips = async () => {
			try {
				setLoading(true);
				// Dispatch an action to fetch trips. Replace `fetchTripsAction` with your actual action
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
            return 'Trip start date has passed.';
        }
        const duration = moment.duration(end.diff(now));
        return `${duration.months()} months, ${duration.days()} days, ${duration.hours()} hours, and ${duration.minutes()} minutes`;
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
                    <Button variant='primary' className='button-proceed' onClick={() => history.push('/edit-create-trip')}>
                        <i className='bi bi-plus-square-fill'></i> Adventure
                    </Button>
                </Col>
            </Row>
            <Row>
                {trips.map((trip, index) => (
                    <Col key={trip.trip_id} md={4} className='mb-4'>
                        <Card className={index === 0 ? 'next-trip' : 'bg-light'}>
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
                                <Button
                                    variant='primary'
                                    className='button-proceed'
                                    onClick={() => history.push(`/trip-details/${trip.trip_id}`)}
                                >
                                    <i className='bi bi-body-text'></i> Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TripsComponent;