import React, { useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const DisplayItineraries = ({ onSelectItinerary, selectedItinerary, onSaveItinerary, trip_id }) => {
	const selectItineraries = (state) => state.itineraries;

	const reduxItineraries = useSelector(state => state.itineraries.itineraries);
	const itinerariesArray = Array.isArray(reduxItineraries) ? reduxItineraries : [];
	
	const uniqueItineraries = itinerariesArray.reduce((acc, itinerary) => {
		const found = acc.find((item) => item.itinerary_id === itinerary.itinerary_id);
		if (!found) acc.push(itinerary);
		return acc;
	}, []);
	const dispatch = useDispatch();

	console.log('Redux itineraries state:', useSelector(state => state.itineraries));

	if (!Array.isArray(reduxItineraries)) {
		console.error('reduxItineraries is not an array', reduxItineraries);
		return null; 
	}

	useEffect(() => {
		if (trip_id) {
			dispatch({ type: 'FETCH_ITINERARIES', payload: trip_id });
		}
	}, [trip_id, dispatch]);

	const handleItineraryChange = (event) => {
		onSelectItinerary({ ...selectedItinerary, [event.target.name]: event.target.value });
	};

	const handleDeleteItinerary = (itineraryId) => {
		dispatch({ type: 'DELETE_ITINERARY', payload: { itineraryId, tripId: trip_id } });
	};

	const createItinerary = () => {
		history.push({
			pathname: '/create-daily-itinerary',
			state: { trip: trip },
		});
	};

	return (
		<Row>
			{uniqueItineraries.length > 0 ? (
				uniqueItineraries.map((itinerary, index) => (
					<Col xs={12} sm={6} md={4} lg={3} key={itinerary.itinerary_id}>
						<Card className='mb-4 op' data-cy="itinerary-item">
							<Card.Body className='op'>
								{selectedItinerary?.itinerary_id === itinerary.itinerary_id ? (
									<div>
										<Card.Title>Edit Itinerary</Card.Title>
										<Form>
											<Form.Group controlId='itineraryDay'>
												<Form.Label>Day</Form.Label>
												<Form.Control
													type='date'
													name='day'
													value={moment(selectedItinerary.day).format('YYYY-MM-DD')}
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
										<Card.Title>Day: {moment(itinerary.day).format('MM/DD/YYYY')}</Card.Title>
										<Card.Text>
											<strong>Location:</strong> {itinerary.location} <br />
											<strong>Activity:</strong> {itinerary.activity} <br />
											<strong>Notes:</strong> {itinerary.notes || 'No notes available'}
										</Card.Text>
										<div className='d-flex justify-content-between'>
											<Button variant='primary' onClick={() => onSelectItinerary(itinerary)}>
												Edit
											</Button>

											<Button variant='danger' onClick={() => handleDeleteItinerary(itinerary.itinerary_id)}>
												Delete
											</Button>
										</div>
									</div>
								)}
							</Card.Body>
						</Card>
					</Col>
				))
			) : (
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>No Itineraries</Card.Title>
							<Card.Text>There are no itineraries for this trip. Click the button below to create one.</Card.Text>
							<Button className='m-2 button-proceed' onClick={createItinerary}>
								Create Daily Itinerary
							</Button>
						</Card.Body>
					</Card>
				</Col>
			)}
		</Row>
	);
};
export default DisplayItineraries;
