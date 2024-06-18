import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const TripsComponent = () => {
    const dispatch = useDispatch();
    const trips = useSelector(state => state.trip);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        console.log('Component: Dispatching FETCH_TRIPS action');
        dispatch({ type: 'FETCH_TRIPS' });

        // Simulate loading and error states
        const timer = setTimeout(() => {
            setLoading(false);
            // setError('Failed to fetch trips.'); // Uncomment to simulate an error
        }, 1000);

        return () => clearTimeout(timer);
    }, [dispatch]);

    const editTrip = () => {
        history.push({
            pathname: '/trip-details',
            state: { trip: mostRecentTrip }
        });
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    const mostRecentTrip = trips.length > 0 ? trips[0] : null;

    return (
        <Container>
           <Row>
            <Col className="mb-4">
            <Button variant="primary" onClick={() => history.push('/edit-create-trip')}>
                    Create New Adventure
                </Button>
            </Col>
        </Row>
        <Row>
                {trips.map((trip) => (
                    <Col key={trip.trip_id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{trip.trip_name}</Card.Title>
                                <Card.Text>
                                    <strong>Start Date:</strong> {new Date(trip.start_date).toLocaleDateString()}
                                    <br />
                                    <strong>End Date:</strong> {new Date(trip.end_date).toLocaleDateString()}
                                    <br />
                                    <strong>Location:</strong> {trip.locales}
                                    <br />
                                    <strong>Destinations</strong> {trip.map_locations}
                                </Card.Text>
                                <Button variant="primary" onClick={() => history.push({
                                    pathname: '/trip-details',
                                    state: { trip: trip }
                                })}>
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )};

export default TripsComponent;
