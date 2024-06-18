import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';

const DisplayItineraries = ({ onSelectItinerary, selectedItinerary, onSaveItinerary }) => {
    const [itineraries, setItineraries] = useState([]);
    const { trip_id } = useParams();

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await axios.get(`/api/itinerary/${trip_id}/itineraries`);
                setItineraries(response.data.data);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            }
        };

        fetchItineraries();
    }, [trip_id]);

    const handleItineraryChange = (event) => {
        onSelectItinerary({ ...selectedItinerary, [event.target.name]: event.target.value });
    };

    return (
        <div>
            {itineraries.map((itinerary, index) => (
                <Card key={index} style={{ marginBottom: '1rem' }}>
                    <Card.Body>
                        {selectedItinerary?.itinerary_id === itinerary.itinerary_id ? (
                            <div>
                                <Card.Title>Edit Itinerary</Card.Title>
                                <Form>
                                    <Form.Group controlId="itineraryDay">
                                        <Form.Label>Day</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="day"
                                            value={new Date(selectedItinerary.day).toISOString().substring(0, 10)}
                                            onChange={handleItineraryChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="itineraryLocation">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="location"
                                            value={selectedItinerary.location}
                                            onChange={handleItineraryChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="itineraryActivity">
                                        <Form.Label>Activity</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="activity"
                                            value={selectedItinerary.activity}
                                            onChange={handleItineraryChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="itineraryNotes">
                                        <Form.Label>Notes</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="notes"
                                            value={selectedItinerary.notes}
                                            onChange={handleItineraryChange}
                                        />
                                    </Form.Group>
                                    <Button variant="success" onClick={() => onSaveItinerary(selectedItinerary)}>
                                        Save Itinerary
                                    </Button>
                                    <Button variant="secondary" onClick={() => onSelectItinerary(null)}>
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
                                <Button variant="primary" onClick={() => onSelectItinerary(itinerary)}>
                                    Edit
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default DisplayItineraries;
