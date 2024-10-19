import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const EditCreateTrips = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const trip = location.state ? location.state.trip : null;

    // Fetch categories from Redux store
    const categories = useSelector((state) => state.categoryReducer.categories);
    console.log('Categories:', categories);

    const [editedTrip, setEditedTrip] = useState(trip || {
        trip_name: '',
        start_date: '',
        end_date: '',
        locales: '',
        map_locations: '',
        category_id: ''  // New category field
    });

    // Fetch categories when the component mounts
    useEffect(() => {
        dispatch({ type: 'FETCH_CATEGORIES' });
    }, [dispatch]);

    const handleInputChange = (event) => {
        setEditedTrip({
            ...editedTrip,
            [event.target.name]: event.target.value
        });
    };

    // Handle category change
    const handleCategoryChange = (event) => {
        setEditedTrip({
            ...editedTrip,
            category_id: event.target.value  // Update category_id when a new category is selected
        });
    };

    const handleSaveClick = async () => {
        try {
            dispatch({ type: 'CREATE_TRIP', payload: editedTrip });
            navigate('/trips');
        } catch (error) {
            console.error('Error creating/updating trip:', error);
        }
    };

    const formatDate = (date) => moment(date).format('YYYY-MM-DD');

    return (
        <Container className='border-container'>
            <Form>
                <Form.Group controlId="tripName">
                    <Form.Label>Trip Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="trip_name" 
                        value={editedTrip.trip_name} 
                        onChange={handleInputChange} 
                    />
                </Form.Group>

                <Form.Group controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control 
                        type="date"
                        name="start_date"
                        value={editedTrip.start_date}
                        onChange={handleInputChange}
                        max={editedTrip.end_date || ''}
                    />
                </Form.Group>

                <Form.Group controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control 
                        type="date"
                        name="end_date"
                        value={editedTrip.end_date}
                        onChange={handleInputChange}
                        min={editedTrip.start_date}
                    />
                </Form.Group>

                <Form.Group controlId="locales">
                    <Form.Label>Location</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="locales" 
                        value={editedTrip.locales} 
                        onChange={handleInputChange} 
                    />
                </Form.Group>

                <Form.Group controlId="mapLocations">
                    <Form.Label>Destinations</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="map_locations" 
                        value={editedTrip.map_locations} 
                        onChange={handleInputChange} 
                    />
                </Form.Group>

                {/* Add Category Dropdown */}
                <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control 
                        as="select" 
                        value={editedTrip.category_id} 
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.category_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" onClick={handleSaveClick}>
                    Save
                </Button>
            </Form>
        </Container>
    );
};

export default EditCreateTrips;