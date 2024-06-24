import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Map from '../Maps/Map';
import './itinerary.css';

const CreateDailyItinerary = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const trip = location.state.trip;
    const tripId = trip.trip_id;
    const mapItems = useSelector(state => state.mapItems.items);

    const [itinerary, setItinerary] = useState({
        day: '',
        location: '',
        latitude: '',
        longitude: '',
        activity: '',
        notes: ''
    });

    useEffect(() => {
        dispatch({ type: 'FETCH_MAP_ITEMS' });
    }, [dispatch]);

    const handleInputChange = (event) => {
        setItinerary({
            ...itinerary,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(`/api/itinerary/${tripId}/itineraries`, itinerary);
            history.push(`/trip-details/${tripId}`);
        } catch (error) {
            console.error('Error creating itinerary:', error);
        }
    };

    const handleMarkerClick = (item) => {
        setItinerary({
            ...itinerary,
            location: item.title,
            description: item.description,
            latitude: item.latitude,
            longitude: item.longitude
        });
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

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
                            <Form.Label className="form-label">Latitude</Form.Label>
                            <Form.Control
                                type="text"
                                name="Latitude"
                                value={itinerary.latitude}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="Longitude">
                            <Form.Label className="form-label">Longitude</Form.Label>
                            <Form.Control
                                type="text"
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

            <Map items={mapItems} onItemClick={handleMarkerClick} />
        </Container>
    );
};

export default CreateDailyItinerary;
