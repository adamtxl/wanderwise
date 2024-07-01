import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';

const TripsComponent = () => {
	const dispatch = useDispatch();
	const trips = useSelector((state) => state.trip.trips || []); // Default to an empty array
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const history = useHistory();
	const [countdown, setCountdown] = useState(null);
	const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });

	useEffect(() => {
		console.log('Component: Dispatching FETCH_TRIPS action');
		dispatch({ type: 'FETCH_TRIPS' });

		// Simulate loading and error states
		const timer = setTimeout(() => {
			setLoading(false);
			// setError('Failed to fetch trips.'); // Uncomment to simulate an error
		}, 1000);

		return () => clearTimeout(timer);
	}, [dispatch]);

	useEffect(() => {
		const findNextTrip = () => {
			const now = moment();
			const nextTrip = trips.find((trip) => moment(trip.start_date).isAfter(now));

			if (nextTrip) {
				const startDate = moment(nextTrip.start_date);
				const timeDiff = moment.duration(startDate.diff(now));

				// Calculate countdown
				const days = timeDiff.days();
				const hours = timeDiff.hours();
				const minutes = timeDiff.minutes();
				const months = timeDiff.months();

				setCountdown(`${months} months, ${days} days, ${hours} hours, and ${minutes} minutes!`);
			} else {
				setCountdown('No upcoming trips');
			}
		};

		if (!loading && !error && trips.length > 0) {
			findNextTrip();
		}
	}, [loading, error, trips]);

	const editTrip = () => {
		history.push({
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
				<Col>
					<Button className='button-proceed' onClick={() => history.push('/past-trips')}>
						View Past Trips
					</Button>
				</Col>
				<Col className='mb-4 d-flex justify-content-center'>
					<Button variant='primary' className='button-proceed' onClick={() => history.push('/edit-create-trip')}>
						<i class='bi bi-plus-square-fill'></i> Adventure
					</Button>
				</Col>
			</Row>
			<Row>
				{trips.map((trip, index) => (
					<Col key={trip.trip_id} md={4} className='mb-4'>
						<Card className={index === 0 ? 'next-trip' : 'bg-light'}>
							<Card.Body>
								<Card.Title >{trip.trip_name}</Card.Title>
								<Card.Text>
									<strong>Start Date:</strong> {new Date(trip.start_date).toLocaleDateString()}
									<br />
									<strong>End Date:</strong> {new Date(trip.end_date).toLocaleDateString()}
									<br />
									<strong>Location:</strong> {trip.locales}
									<br />
									<strong>Destinations:</strong> {trip.map_locations}
								</Card.Text>
								<Button
									variant='primary'
									className='button-proceed'
									onClick={() => history.push(`/trip-details/${trip.trip_id}`)}
								>
									<i class='bi bi-body-text'></i> Details
								</Button>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
			<Row>
				<Col md={4} className='mb-4'>
					{countdown && (
						<Card>
							<Card.Body>
								<Card.Title>Countdown to Next Trip</Card.Title>
								<Card.Text>{countdown}</Card.Text>
							</Card.Body>
						</Card>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default TripsComponent;
