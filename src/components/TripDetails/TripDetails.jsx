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

	const categories = useSelector((state) => state.categoryReducer.categories);
	const reduxItineraries = useSelector((state) => state.itinerary) || [];
	const [backgroundImage, setBackgroundImage] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editedTrip, setEditedTrip] = useState(trip);
	const [selectedItinerary, setSelectedItinerary] = useState(null);

	const getCategoryBackground = (category_id) => {
		switch (category_id) {
			case 1: return '/images/beach.jpeg';
			case 2: return '/images/Alaska-Desktop-Summer.jpeg';
			case 3: return '/images/cityscape.jpeg';
			case 4: return '/images/highway.jpeg';
			case 5: return '/images/desert.jpeg';
			case 6: return '/images/forest.jpeg';
			case 7: return '/images/countryside.jpeg';
			case 8: return '/images/island.jpeg';
			case 9: return '/images/winter.jpeg';
			case 10: return '/images/landmarks.jpeg';
			case 11: return '/images/themepark.jpeg';
			default: return '/images/generic.jpeg';
		}
	};

	const handleSelectItinerary = (itinerary) => {
		setSelectedItinerary(itinerary);
	};

	const handleMarkerClick = (location) => {
		const matchingItinerary = reduxItineraries.find(itinerary => itinerary.location === location.title);
		if (matchingItinerary) {
			handleSelectItinerary(matchingItinerary);
		}
	};

	useEffect(() => {
		if (tripId) {
			dispatch({ type: 'FETCH_TRIP_BY_ID', payload: tripId });
			dispatch({ type: 'FETCH_CATEGORIES' });
			dispatch({ type: 'FETCH_ITINERARIES_WITH_MAP_ITEMS', payload: tripId });
		}
	}, [dispatch, tripId]);

	useEffect(() => {
		if (JSON.stringify(trip) !== JSON.stringify(editedTrip)) {
			setEditedTrip(trip);
		}
	}, [trip, editedTrip]);

	useEffect(() => {
		if (trip.category_id) {
			const categoryImage = getCategoryBackground(trip.category_id);
			if (categoryImage !== backgroundImage) {
				setBackgroundImage(categoryImage);
			}
		}
	}, [trip.category_id, backgroundImage]);

	const handleInputChange = (event) => {
		setEditedTrip({ ...editedTrip, [event.target.name]: event.target.value });
	};

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
		<Container
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				minHeight: '100vh',
			}}
		>
			<Row>
				<Col className='border-container'>
					<Card className='mb-4'>
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
									<strong className='label'>{trip.trip_name}</strong>
								)}
							</Card.Title>
							<Card.Text>
								<strong>Start Date:</strong>{' '}
								{isEditing ? (
									<Form.Control
										type='date'
										name='start_date'
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
										type='date'
										name='end_date'
										value={moment(editedTrip.end_date).format('YYYY-MM-DD')}
										onChange={handleInputChange}
									/>
								) : (
									moment(trip.end_date).local().format('MM/DD/YYYY')
								)}
								<br />
								<strong>Locations:</strong>{' '}
								{isEditing ? (
									<Form.Control type='text' name='locales' value={editedTrip.locales} onChange={handleInputChange} />
								) : (
									trip.locales
								)}
								<br />
								<strong>Category:</strong>{' '}
								{isEditing ? (
									<Form.Control as='select' value={editedTrip.category_id} onChange={handleCategoryChange}>
										<option value=''>Select a category</option>
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
										type='text'
										name='map_locations'
										value={editedTrip.map_locations}
										onChange={handleInputChange}
									/>
								) : (
									trip.map_locations
								)}
							</Card.Text>
							{isEditing ? (
								<Button variant='success' onClick={handleSaveClick}>
									Save
								</Button>
							) : (
								<Button variant='primary' onClick={handleEditClick}>
									Edit Trip
								</Button>
							)}
							<Button className='m-2' onClick={() => navigate(`/create-daily-itinerary/${trip.trip_id}`)}>
								Create Daily Itinerary
							</Button>
							<Button className='m-2' onClick={() => navigate(`/packing-list/${trip.trip_id}`)}>
								Go to Packing List
							</Button>
							<Button className='m-2' onClick={() => navigate(`/checklist/${trip.trip_id}`)}>
								Go to Trip Checklist
							</Button>
							<Button variant='danger' onClick={handleDeleteClick}>
								Delete Trip
							</Button>
						</Card.Body>
					</Card>
					<TripCollaborators trip_id={trip.trip_id} />
				</Col>
			</Row>
			<Row className='border-container'>
				<Col>
					<DisplayItineraries 
                        trip_id={trip.trip_id} 
                        onSelectItinerary={handleSelectItinerary}
                        selectedItinerary={selectedItinerary}
                    />
				</Col>
			</Row>
			<Row>
				<Col>
					<TripMap tripId={trip.trip_id} onMarkerClick={handleMarkerClick} />
				</Col>
			</Row>
		</Container>
	);
};

const mapStoreToProps = (store) => ({
	itineraries: store.itinerary,
});

export default connect(mapStoreToProps)(TripDetails);