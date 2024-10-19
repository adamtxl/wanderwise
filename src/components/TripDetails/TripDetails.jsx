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
        category_id: '', // Include category_id
    };

    // Fetch categories from Redux store
    const categories = useSelector((state) => state.categoryReducer.categories);
    const [backgroundImage, setBackgroundImage] = useState('');  // State for dynamic background

    const getCategoryBackground = (category_id) => {
        switch (category_id) {
            case 1: return '/images/beach.jpeg'; // Beach
            case 2: return '/images/Alaska-Desktop-Summer.jpeg'; // Mountains
            case 3: return '/images/cityscape.jpeg'; // Cityscape
            case 4: return '/images/highway.jpeg'; // Road Trip/Highway
            case 5: return '/images/desert.jpeg'; // Desert
            case 6: return '/images/forest.jpeg'; // Forest
            case 7: return '/images/countryside.jpeg'; // Countryside/Farmland
            case 8: return '/images/island.jpeg'; // Tropical Island
            case 9: return '/images/winter.jpeg'; // Winter Wonderland
            case 10: return '/images/landmarks.jpeg'; // Historical/Landmarks
            case 11: return '/images/themepark.jpeg'; // Theme Parks
            default: return '/images/generic.jpeg'; // Fallback
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editedTrip, setEditedTrip] = useState(trip);
    const [selectedItinerary, setSelectedItinerary] = useState(null);

    useEffect(() => {
        if (tripId) {
            dispatch({ type: 'FETCH_TRIP_BY_ID', payload: tripId });
            dispatch({ type: 'FETCH_CATEGORIES' }); // Fetch categories when component mounts
        }
    }, [dispatch, tripId]);

    // Update the editedTrip state whenever trip details are updated
    useEffect(() => {
        setEditedTrip(trip);
    }, [trip]);

    // Set the background image when the category_id changes
    useEffect(() => {
        if (trip.category_id) {
            const categoryImage = getCategoryBackground(trip.category_id);
            setBackgroundImage(categoryImage);
        }
    }, [trip.category_id]); // Now it will trigger on category_id change

    const handleInputChange = (event) => {
        setEditedTrip({ ...editedTrip, [event.target.name]: event.target.value });
    };

    // Handle category change
    const handleCategoryChange = (event) => {
        setEditedTrip({ ...editedTrip, category_id: event.target.value });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveClick = async () => {
        try {
            await dispatch({ type: 'UPDATE_TRIP', payload: editedTrip });
            setIsEditing(false);
            // Fetch the updated trip details
            dispatch({ type: 'FETCH_TRIP_BY_ID', payload: editedTrip.trip_id });
        } catch (error) {
            console.error('Error updating trip:', error);
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
        <Container style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
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
                                <strong>Category:</strong>{' '}
                                {isEditing ? (
                                    <Form.Control
                                        as="select"
                                        value={editedTrip.category_id}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.category_id} value={category.category_id}>
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                ) : (
                                    categories.find((cat) => cat.category_id === trip.category_id)?.category_name || 'Unknown'
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
                            <Button className="m-2" onClick={() => navigate(`/create-daily-itinerary/${trip.trip_id}`)}>
                                Create Daily Itinerary
                            </Button>
                            <Button className="m-2" onClick={() => navigate(`/packing-list/${trip.trip_id}`)}>
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
                    <DisplayItineraries trip_id={trip.trip_id} />
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