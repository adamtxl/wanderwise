import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditCreateTrips = () => {
    const location = useLocation();
    const history = useHistory();
    const trip = location.state ? location.state.trip : null;
    const [editedTrip, setEditedTrip] = useState(trip || {
        trip_name: '',
        start_date: '',
        end_date: '',
        locales: '',
        map_locations: ''
    });

    const handleInputChange = (event) => {
        setEditedTrip({
            ...editedTrip,
            [event.target.name]: event.target.value
        });
    };

    const handleSaveClick = async () => {
        try {
            if (trip) {
                await axios.put(`/api/trips/${trip.trip_id}`, editedTrip);
            } else {
                await axios.post('/api/trips', editedTrip);
            }
            history.push('/trips');
        } catch (error) {
            console.error('Error updating trip:', error);
        }
    };

    return (
        <Form>
            <Form.Group controlId="tripName">
                <Form.Label>Trip Name</Form.Label>
                <Form.Control type="text" name="trip_name" value={editedTrip.trip_name} onChange={handleInputChange} />
            </Form.Group>
    
            <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" name="start_date" value={editedTrip.start_date} onChange={handleInputChange} />
            </Form.Group>
    
            <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" name="end_date" value={editedTrip.end_date} onChange={handleInputChange} />
            </Form.Group>
    
            <Form.Group controlId="locales">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="locales" value={editedTrip.locales} onChange={handleInputChange} />
            </Form.Group>
    
            <Form.Group controlId="mapLocations">
                <Form.Label>Destinations</Form.Label>
                <Form.Control type="text" name="map_locations" value={editedTrip.map_locations} onChange={handleInputChange} />
            </Form.Group>
    
            <Button variant="primary" onClick={handleSaveClick}>
                Save
            </Button>
        </Form>
    )};

export default EditCreateTrips;