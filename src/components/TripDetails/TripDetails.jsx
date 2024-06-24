import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import TripMap from './TripMap'; // Adjust path as per your actual file structure
import DisplayItineraries from '../DailyItinerary/DisplayItinerary';

const TripDetails = () => {
    const location = useLocation();
    const trip = useSelector((state) => state.tripDetailReducer?.currentTrip?.data) || {
        trip_id: '',
        trip_name: '',
        start_date: '',
        end_date: '',
        locales: '',
        map_locations: '',
    };
    const [isEditing, setIsEditing] = useState(false);
    const [editedTrip, setEditedTrip] = useState(trip);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const { trip_id: tripIdFromParams } = useParams();
    const trip_id = tripIdFromParams;
    const state = useSelector((state) => state);

    useEffect(() => {
        dispatch({ type: 'FETCH_TRIP_BY_ID', payload: trip_id });
    }, [dispatch, trip_id]);

    const createItinerary = () => {
        history.push({
            pathname: '/create-daily-itinerary',
            state: { trip: trip },
        });
    };

    const goToPackingList = () => {
        history.push(`/packing-list/${trip.trip_id}`);
    };

    const handleInputChange = (event) => {
        setEditedTrip({ ...editedTrip, [event.target.name]: event.target.value });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveClick = async () => {
        try {
            dispatch({ type: 'UPDATE_TRIP', payload: editedTrip });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating trip:', error);
        }
    };

    const handleSaveItinerary = async (itinerary) => {
        try {
            dispatch({ type: 'UPDATE_ITINERARY', payload: itinerary });
            setSelectedItinerary(null);
            dispatch({ type: 'FETCH_ITINERARIES', payload: trip.trip_id });
        } catch (error) {
            console.error('Error updating itinerary:', error);
        }
    };

    const handleDeleteClick = async () => {
        try {
            dispatch({ type: 'DELETE_TRIP', payload: trip.trip_id });
            history.push('/trips');
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                {isEditing ? (
                                    <Form.Control
                                        type='text'
                                        name='trip_name'
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
                                        type='date'
                                        name='start_date'
                                        value={editedTrip.start_date}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    new Date(trip.start_date).toLocaleDateString()
                                )}
                                <br />
                                <strong>End Date:</strong>
                                {isEditing ? (
                                    <Form.Control type='date' name='end_date' value={editedTrip.end_date} onChange={handleInputChange} />
                                ) : (
                                    new Date(trip.end_date).toLocaleDateString()
                                )}
                                <br />
                                <strong>Locales:</strong>
                                {isEditing ? (
                                    <Form.Control type='text' name='locales' value={editedTrip.locales} onChange={handleInputChange} />
                                ) : (
                                    trip.locales
                                )}
                                <br />
                                <strong>Map Locations:</strong>
                                {isEditing ? (
                                    <Form.Control
                                        type='text'
                                        name='map_locations'
                                        value={editedTrip.map_locations}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    trip.map_locations
                                )}
                            </Card.Text>
                            {isEditing ? (
                                <Button variant='success' onClick={handleSaveClick}>
                                    Save
                                </Button>
                            ) : (
                                <Button variant='primary' onClick={handleEditClick}>
                                    Edit Trip
                                </Button>
                            )}
                            <Button className="m-2" onClick={createItinerary}>Create Daily Itinerary</Button>
                            <Button className="m-2" onClick={goToPackingList}>Go to Packing List</Button>
                            <Button variant='danger' onClick={handleDeleteClick}>
                                Delete Trip
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TripMap tripId={trip.trip_id} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <DisplayItineraries
                        onSelectItinerary={setSelectedItinerary}
                        selectedItinerary={selectedItinerary}
                        onSaveItinerary={handleSaveItinerary}
                        trip_id={trip_id}
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
