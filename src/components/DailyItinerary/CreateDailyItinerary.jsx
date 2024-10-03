import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Map from '../Maps/Map';
import './itinerary.css';
import moment from 'moment';

const CreateDailyItinerary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const trip = location.state.trip;
    const tripId = trip.trip_id;
    const mapItems = useSelector(state => state.mapItems.items);

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
    }, [dispatch]);

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
            // Dispatch ADD_ITINERARY action with itinerary details
            dispatch({ type: 'ADD_ITINERARY', payload: { itinerary, tripId } });
            dispatch({ type: 'FETCH_MAP_ITEMS' });
            navigate(`/trip-details/${tripId}`);
        } catch (error) {
            console.error('Error creating itinerary:', error);
        }
    };

    const handleMarkerClick = (item) => {
        // Update itinerary state with the clicked marker data
        setItinerary({
            ...itinerary,
            location: item.title,
            latitude: item.latitude,
            longitude: item.longitude,
            description: item.description
        });
    };

    const formatDate = (date) => moment(date).format('YYYY-MM-DD');

    const tripStartDate = formatDate(trip.start_date);
    const tripEndDate = formatDate(trip.end_date);

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
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="Latitude">
                            <Form.Control
                                type="hidden"
                                name="Latitude"
                                value={itinerary.latitude}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="Longitude">
                            <Form.Control
                                type="hidden"
                                name="Longitude"
                                value={itinerary.longitude}
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

            {/* Pass the `mapItems` and `handleMarkerClick` function to the Map component */}
            <Map markers={mapItems} onItemClick={handleMarkerClick} />
        </Container>
    );
};

export default CreateDailyItinerary;