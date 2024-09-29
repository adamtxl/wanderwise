import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import TripMap from './TripMap'; // Adjust path as per your actual file structure
import DisplayItineraries from '../DailyItinerary/DisplayItinerary';
import moment from 'moment';
import TripCollaborators from '../Collaborators/TripCollaborators';

const TripDetails = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tripId } = useParams();

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

    useEffect(() => {
        if (tripId) {
            dispatch({ type: 'FETCH_TRIP_BY_ID', payload: tripId });
        }
    }, [dispatch, tripId]);

    useEffect(() => {
        setEditedTrip(trip);
    }, [trip]);
    
    console.log("tripId from params:", tripId);

    const createItinerary = () => {
        navigate('/create-daily-itinerary', { state: { trip: trip } });
    };

    const goToPackingList = () => {
        navigate(`/packing-list/${trip.trip_id}`);
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
            dispatch({ type: 'FETCH_ITINERARIES', payload: itinerary.trip_id });
        } catch (error) {
            console.error('Error updating itinerary:', error);
        }
    };

    const handleDeleteClick = async () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this trip? This action cannot be undone.');
        if (isConfirmed) {
            try {
                dispatch({ type: 'DELETE_TRIP', payload: trip.trip_id });
                navigate('/trips');
            } catch (error) {
                console.error('Error deleting trip:', error);
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col className="border-container">
                    <Card className="mb-4">
                        <Card.Body className="bg-travel">
                            <Card.Title>
                                {isEditing ? (
                                    <Form.Control
                                        type="text"
                                        name="trip_name"
                                        value={editedTrip.trip_name}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <strong className="label">{trip.trip_name}</strong>
                                )}
                            </Card.Title>
                            <Card.Text>
                                <strong>Start Date:</strong>{' '}
                                {isEditing ? (
                                    <Form.Control
                                        type="date"
                                        name="start_date"
                                        value={moment(editedTrip.start_date).format('YYYY-MM-DD')}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    moment(trip.start_date).local().format('MM/DD/YYYY')
                                )}
                                <br />
                                <strong>End Date:</strong>{' '}
                                {isEditing ? (
                                    <Form.Control
                                        type="date"
                                        name="end_date"
                                        value={moment(editedTrip.end_date).format('YYYY-MM-DD')}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    moment(trip.end_date).local().format('MM/DD/YYYY')
                                )}
                                <br />
                                <strong>Locations:</strong>{' '}
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
                                <strong>Map Locations:</strong>{' '}
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
                            <Button className="m-2" onClick={createItinerary}>
                                Create Daily Itinerary
                            </Button>
                            <Button className="m-2" onClick={goToPackingList}>
                                Go to Packing List
                            </Button>
                            <Button variant="danger" onClick={handleDeleteClick}>
                                Delete Trip
                            </Button>
                        </Card.Body>
                    </Card>
                    <TripCollaborators trip_id={trip.trip_id} />
                </Col>
            </Row>
            <Row className="border-container">
                <Col>
                    <DisplayItineraries
                        onSelectItinerary={setSelectedItinerary}
                        selectedItinerary={selectedItinerary}
                        onSaveItinerary={handleSaveItinerary}
                        trip_id={trip.trip_id}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TripMap tripId={trip.trip_id} />
                </Col>
            </Row>
        </Container>
    );
};

const mapStoreToProps = (store) => ({
    itineraries: store.itinerary,
});

export default connect(mapStoreToProps)(TripDetails);