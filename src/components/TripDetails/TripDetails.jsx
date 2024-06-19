import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import DisplayItineraries from '../DailyItinerary/DisplayItinerary';

const TripDetails = ({ itineraries }) => {
    const location = useLocation();
    const trip = location.state?.trip || {};
    const [isEditing, setIsEditing] = useState(false);
    const [editedTrip, setEditedTrip] = useState(trip);
    const [selectedItinerary, setSelectedItinerary] = useState(null); // New state for selected itinerary
    const dispatch = useDispatch();
    const history = useHistory();
    const { trip_id } = useParams();

    useEffect(() => {
        dispatch({ type: 'FETCH_ITINERARIES', payload: trip.trip_id });
    }, [dispatch, trip.trip_id]);

    const createItinerary = () => {
        history.push({
            pathname: '/create-daily-itinerary',
            state: { trip: trip }
        });
    };

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

    const handleSaveItinerary = async (itinerary) => {
        try {
            await axios.put(`/api/itineraries/${itinerary.itinerary_id}`, itinerary);
            setSelectedItinerary(null); // Clear selected itinerary after saving
            dispatch({ type: 'FETCH_ITINERARIES', payload: trip.trip_id });
        } catch (error) {
            console.error('Error updating itinerary:', error);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
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
                            <Button onClick={createItinerary}>Create Daily Itinerary</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DisplayItineraries
                        onSelectItinerary={setSelectedItinerary}
                        selectedItinerary={selectedItinerary}
                        onSaveItinerary={handleSaveItinerary}
                    />
                </Col>
            </Row>
        </Container>
    );
};

const mapStoreToProps = (store) => ({
    itineraries: store.itinerary,
});

export default connect(mapStoreToProps)(TripDetails);