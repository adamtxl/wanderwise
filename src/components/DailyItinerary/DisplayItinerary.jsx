import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

const DisplayItineraries = ({ onSelectItinerary, selectedItinerary, onSaveItinerary, trip_id }) => {
    const [itineraries, setItineraries] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (trip_id) {
            const fetchItineraries = async () => {
                try {
                    const response = await axios.get(`/api/itinerary/${trip_id}/itineraries`);
                    setItineraries(response.data.data);
                } catch (error) {
                    console.error('Error fetching itineraries:', error);
                }
            };
            fetchItineraries();
        }
    }, [trip_id]);

    const handleItineraryChange = (event) => {
        onSelectItinerary({ ...selectedItinerary, [event.target.name]: event.target.value });
    };

    const handleDeleteItinerary = (itineraryId) => {
        dispatch({ type: 'DELETE_ITINERARY', payload: { itineraryId, tripId: trip_id } });
    };

    return (
        <Row>
            {itineraries.map((itinerary, index) => (
                <Col xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card className="mb-4">
                        <Card.Body>
                            {selectedItinerary?.itinerary_id === itinerary.itinerary_id ? (
                                <div>
                                    <Card.Title>Edit Itinerary</Card.Title>
                                    <Form>
                                        <Form.Group controlId='itineraryDay'>
                                            <Form.Label>Day</Form.Label>
                                            <Form.Control
                                                type='date'
                                                name='day'
                                                value={new Date(selectedItinerary.day).toISOString().substring(0, 10)}
                                                onChange={handleItineraryChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId='itineraryLocation'>
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='location'
                                                value={selectedItinerary.location}
                                                onChange={handleItineraryChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId='itineraryActivity'>
                                            <Form.Label>Activity</Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='activity'
                                                value={selectedItinerary.activity}
                                                onChange={handleItineraryChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId='itineraryNotes'>
                                            <Form.Label>Notes</Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='notes'
                                                value={selectedItinerary.notes}
                                                onChange={handleItineraryChange}
                                            />
                                        </Form.Group>
                                        <Button variant='success' onClick={() => onSaveItinerary(selectedItinerary)}>
                                            Save Itinerary
                                        </Button>
                                        <Button variant='secondary' onClick={() => onSelectItinerary(null)}>
                                            Cancel
                                        </Button>
                                    </Form>
                                </div>
                            ) : (
                                <div>
                                    <Card.Title>Day: {new Date(itinerary.day).toLocaleDateString()}</Card.Title>
                                    <Card.Text>
                                        <strong>Location:</strong> {itinerary.location} <br />
                                        <strong>Activity:</strong> {itinerary.activity} <br />
                                        <strong>Notes:</strong> {itinerary.notes || 'No notes available'}
                                    </Card.Text>
                                    <Button variant='primary' onClick={() => onSelectItinerary(itinerary)}>
                                        Edit
                                    </Button>
                                    <Button variant='danger' onClick={() => handleDeleteItinerary(itinerary.itinerary_id)}>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default DisplayItineraries;
