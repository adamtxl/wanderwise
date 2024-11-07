import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Map from '../Maps/Map';
import './itinerary.css';
import moment from 'moment';

const CreateDailyItinerary = () => {
    const { tripId } = useParams(); // Get tripId from URL parameters
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const trip = useSelector((state) => state.tripDetailReducer.currentTrip?.data); // Fetch trip details from Redux
    const mapItems = useSelector((state) => state.mapItems.items);

    const [itinerary, setItinerary] = useState({
        day: '',
        location: '',
        latitude: '40.813600',
        longitude: '-96.789800',
        activity: '',
        notes: ''
    });

    useEffect(() => {
        console.log('Fetching map items');
        dispatch({ type: 'FETCH_MAP_ITEMS' });
        dispatch({ type: 'FETCH_TRIP_BY_ID', payload: tripId }); // Ensure trip details are fetched
    }, [dispatch, tripId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setItinerary(prevItinerary => ({
            ...prevItinerary,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Step 1: Dispatch action to add itinerary
            const addItineraryResponse = await dispatch({ 
                type: 'ADD_ITINERARY', 
                payload: { itinerary, tripId } 
            });
    
            // Step 2: Get new itinerary ID from response if possible
            const newItineraryId = addItineraryResponse?.data?.id; // Adjust if addItinerary saga returns data
    
            // Step 3: Dispatch action to link map item with itinerary if map item is set
            if (newItineraryId && itinerary.map_item_id) {
                dispatch({
                    type: 'ADD_ITINERARY_MAP_ITEM',
                    payload: {
                        itinerary_id: newItineraryId,
                        map_item_id: itinerary.map_item_id
                    }
                });
            }
    
            // Navigate back to Trip Details after creation
            navigate(`/trip-details/${tripId}`);
        } catch (error) {
            console.error('Error creating itinerary:', error);
        }
    };
    const handleMarkerClick = (item) => {
        setItinerary({
            ...itinerary,
            location: item.title,
            latitude: item.latitude,
            longitude: item.longitude,
            map_item_id: item.id // Capture the map item ID
        });
    };

    const formatDate = (date) => moment(date).format('YYYY-MM-DD');

    const tripStartDate = trip ? formatDate(trip.start_date) : '';
    const tripEndDate = trip ? formatDate(trip.end_date) : '';

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="day">
                            <Form.Label className="form-label">Day</Form.Label>
                            <Form.Control
                                type="date"
                                name="day"
                                value={itinerary.day}
                                onChange={handleInputChange}
                                min={tripStartDate}
                                max={tripEndDate}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="location">
                            <Form.Label className="form-label">Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={itinerary.location}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="description">
                            <Form.Label className="form-label">Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={itinerary.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="activity">
                            <Form.Label className="form-label">Activity</Form.Label>
                            <Form.Control
                                type="text"
                                name="activity"
                                value={itinerary.activity}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="notes">
                    <Form.Label className="form-label">Notes</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="notes"
                        value={itinerary.notes}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>

            <Map markers={mapItems} onItemClick={handleMarkerClick} />
        </Container>
    );
};

export default CreateDailyItinerary;