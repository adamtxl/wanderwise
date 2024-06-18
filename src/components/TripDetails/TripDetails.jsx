import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const TripDetails = () => {
    const location = useLocation();
    const trip = location.state.trip;
    const [isEditing, setIsEditing] = useState(false);
    const [editedTrip, setEditedTrip] = useState(trip);
    const dispatch = useDispatch();
    console.log('Trip:', trip);
    useEffect(() => {
        dispatch({ type: 'FETCH_ITINERARIES', payload: trip.trip_id });
    }, [dispatch, trip.id]);


    const handleInputChange = (event) => {
        setEditedTrip({ ...editedTrip, [event.target.name]: event.target.value });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`/api/trips/${trip.trip_id}`, editedTrip);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating trip:', error);
        }
    };
    console.log('Trip:', trip);
    if (trip) {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        {isEditing ? (
                            <Form.Control
                                type="text"
                                name="trip_name"
                                value={editedTrip.trip_name}
                                onChange={handleInputChange}
                            />
                        ) : (
                            trip.trip_name
                        )}
                    </Card.Title>
                    <Card.Text>
                        <strong>Start Date:</strong>
                        {isEditing ? (
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={editedTrip.start_date}
                                onChange={handleInputChange}
                            />
                        ) : (
                            new Date(trip.start_date).toLocaleDateString()
                        )}
                        <br />
                        <strong>End Date:</strong>
                        {isEditing ? (
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={editedTrip.end_date}
                                onChange={handleInputChange}
                            />
                        ) : (
                            new Date(trip.end_date).toLocaleDateString()
                        )}
                        <br />
                        <strong>Locales:</strong>
                        {isEditing ? (
                            <Form.Control
                                type="text"
                                name="locales"
                                value={editedTrip.locales}
                                onChange={handleInputChange}
                            />
                        ) : (
                            trip.locales
                        )}
                        <br />
                        <strong>Map Locations:</strong>
                        {isEditing ? (
                            <Form.Control
                                type="text"
                                name="map_locations"
                                value={editedTrip.map_locations}
                                onChange={handleInputChange}
                            />
                        ) : (
                            trip.map_locations
                        )}
                    </Card.Text>
                    {isEditing ? (
                        <Button variant="success" onClick={handleSaveClick}>
                            Save
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleEditClick}>
                            Edit Trip
                        </Button>
                    )}
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
const mapStoreToProps = (store) => ({
    trip: store.trip,
    itineraries: store.itinerary,
}); 

export default connect(mapStoreToProps)(TripDetails);