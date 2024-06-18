import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';

const CreateDailyItinerary = () => {
    const history = useHistory();
    const [itinerary, setItinerary] = useState({
        day: '',
        location: '',
        activity: '',
        notes: ''
    });
    const location = useLocation();
    const trip = location.state.trip;
    const tripId = trip.trip_id;

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
            history.push('/trips');
        } catch (error) {
            console.error('Error creating itinerary:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="day">
                <Form.Label>Day</Form.Label>
                <Form.Control type="date" name="day" value={itinerary.day} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="location" value={itinerary.location} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="activity">
                <Form.Label>Activity</Form.Label>
                <Form.Control type="text" name="activity" value={itinerary.activity} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" rows={3} name="notes" value={itinerary.notes} onChange={handleInputChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
};

export default CreateDailyItinerary;