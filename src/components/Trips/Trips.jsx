import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const TripsComponent = () => {
    const dispatch = useDispatch();
    const trips = useSelector(state => state.trips || []); // Ensure trips is an empty array if undefined

    useEffect(() => {
        dispatch({ type: 'FETCH_TRIPS' });
    }, [dispatch]);
console.log('trips!', trips);
    return (
        <Container>
            <Row>
                {trips.length > 0 ? (
                    trips.map(trip => (
                        <Col key={trip.trip_id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{trip.trip_name}</Card.Title>
                                    <Card.Text>
                                        <strong>Start Date:</strong> {trip.start_date}<br />
                                        <strong>End Date:</strong> {trip.end_date}<br />
                                        <strong>Locales:</strong> {trip.locales}<br />
                                        <strong>Map Locations:</strong> {trip.map_locations}
                                    </Card.Text>
                                    <Button variant="primary">View Details</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No trips available.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default TripsComponent;
