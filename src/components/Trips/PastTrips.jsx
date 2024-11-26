import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const PastTripsComponent = () => {
	const dispatch = useDispatch();
	const trips = useSelector((state) => state.trip.trips || []); // Default to an empty array
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(null);

	useEffect(() => {
		dispatch({ type: 'FETCH_PAST_TRIPS' });

		// Simulate loading and error states
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, [dispatch]);

	const editTrip = () => {
		navigate({
			pathname: '/trip-details',
			state: { trip: trips[0] },
		});
	};

	if (loading) {
		return <Spinner animation='border' />;
	}

	if (error) {
		return <Alert variant='danger'>{error}</Alert>;
	}

	return (
		<Container>
			<Row>
				<Col className='mb-4'>
					<Button variant='primary' onClick={() => history.push('/edit-create-trip')}>
						Create New Adventure
					</Button>
				</Col>
			</Row>
			<Row>
				{trips.map((trip, index) => (
					<Col key={trip.trip_id} md={4} className='mb-4'>
						<Card className='trip-card op'>
							<Card.Body>
								<Card.Title>{trip.trip_name}</Card.Title>
								<Card.Text>
									<strong>Start Date:</strong> {moment(trip.start_date).format('MM/DD/YYYY')}
									<br />
									<strong>End Date:</strong> {moment(trip.end_date).format('MM/DD/YYYY')}
									<br />
									<strong>Location:</strong> {trip.locales}
									<br />
									<strong>Destinations:</strong> {trip.map_locations}
								</Card.Text>
								<Button variant='primary' onClick={() => navigate(`/trip-details/${trip.trip_id}`)}>
									View Details
								</Button>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
};

export default PastTripsComponent;
