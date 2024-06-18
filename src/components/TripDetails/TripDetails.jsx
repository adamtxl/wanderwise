import React from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const TripDetails = () => {
    const location = useLocation();
    const trip = location.state.trip;
    console.log('TripDetails:', trip);
    if (trip) {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>{trip.trip_name}</Card.Title>
                    <Card.Text>
                        <strong>Start Date:</strong> {new Date(trip.start_date).toLocaleDateString()}<br />
                        <strong>End Date:</strong> {new Date(trip.end_date).toLocaleDateString()}<br />
                        <strong>Locales:</strong> {trip.locales}<br />
                        <strong>Map Locations:</strong> {trip.map_locations}
                    </Card.Text>
                    <Button variant="primary">Edit Trip</Button>
                </Card.Body>
            </Card>
        );
    } else {
        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <h2>Create New Trip</h2>
                        <Form>
                            
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default TripDetails;