import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import TripMap from './TripMap'; // Adjust path as per your actual file structure
import DisplayItineraries from '../DailyItinerary/DisplayItinerary';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

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
            console.log('itinerary', itinerary);
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
                history.push('/trips');
            } catch (error) {
                console.error('Error deleting trip:', error);
            }
        }
    };

    return (
        <Container >
            <Row >
                <Col className='border-container'>
                    <Card className="mb-4 op fullwidth">
                        <Card.Body className='bg-travel'>
                            <Card.Title>
                                {isEditing ? (
                                    <Form.Control
                                        type='text'
                                        name='trip_name'
                                        value={editedTrip.trip_name}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <strong><strong className='label'>{trip.trip_name}</strong></strong>
                                )}
                            </Card.Title>
                            <Card.Text>
                                <strong> <strong>Start Date: </strong></strong>
                                {isEditing ? (
                                    <Form.Control
                                        type='date'
                                        name='start_date'
                                        value={editedTrip.start_date}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <strong>{new Date(trip.start_date).toLocaleDateString()}</strong>
                                )}
                                <br />
                               <strong> <strong>End Date: </strong></strong>
                                {isEditing ? (
                                    <Form.Control type='date' name='end_date' value={editedTrip.end_date} onChange={handleInputChange} />
                                ) : (
                                    <strong>{new Date(trip.end_date).toLocaleDateString()}</strong>
                                )}
                                <br />
                               <strong> <strong>Locations: </strong></strong>
                                {isEditing ? (
                                    <Form.Control type='text' name='locales' value={editedTrip.locales} onChange={handleInputChange} />
                                ) : (
                                   <strong> {trip.locales}</strong>
                                )}
                                <br />
                                <strong><strong>Map Locations: </strong></strong>
                                {isEditing ? (
                                    <Form.Control
                                        type='text'
                                        name='map_locations'
                                        value={editedTrip.map_locations}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <strong>{trip.map_locations}</strong>
                                )}
                            </Card.Text>
                            {isEditing ? (
                                <Button variant='success' onClick={handleSaveClick}>
                                    Save
                                </Button>
                            ) : (
                                <Button variant='primary' className='button-proceed' onClick={handleEditClick}>
                                    Edit Trip
                                </Button>
                            )}
                            <Button className="m-2 button-proceed" onClick={createItinerary}>Create Daily Itinerary</Button>
                            <Button className="m-2 button-proceed" onClick={goToPackingList}>Go to Packing List</Button>
                            <Button variant='danger' className='button-remove' onClick={handleDeleteClick}>
                                Delete Trip
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className='border-container'>
                <Col>
                    <DisplayItineraries
                        onSelectItinerary={setSelectedItinerary}
                        selectedItinerary={selectedItinerary}
                        onSaveItinerary={handleSaveItinerary}
                        trip_id={trip_id}
                    />
                </Col>
            </Row>
            <Row className=''>
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
