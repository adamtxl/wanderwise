import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import TripDetails from '../TripDetails/TripDetails';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AdminRoute from '../ProtectedRoute/AdminRoute';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import Trips from '../Trips/Trips';
import EditCreateTrips from '../EditCreateTrips/EditCreateTrips';
import DailyItinerary from '../DailyItinerary/CreateDailyItinerary';
import PackingList from '../PackingList/PackingList';
import MapPage from '../Maps/MapPage';
import PastTrips from '../Trips/PastTrips';
import AdminPage from '../AdminPage/AdminPage';
import NonAdminLanding from '../AdminPage/NonAdminLanding';
import ChecklistComponent from '../Checklist/Checklist';

function App() {
	const dispatch = useDispatch();
	const trips = useSelector((state) => state.trip.trips || []); // Fetch trips from the store
	const currentTrip = useSelector((state) => state.tripDetailReducer?.currentTrip?.data); // Fetch the currently viewed trip
	const [backgroundImage, setBackgroundImage] = useState('');

	useEffect(() => {
		dispatch({ type: 'FETCH_USER' }); // Fetch the user's session when the app loads
		dispatch({ type: 'FETCH_TRIPS' }); // Fetch trips when the app loads
	}, [dispatch]);

	const getCategoryBackground = (category_id) => {
		switch (category_id) {
			case 1:
				return '/images/beach.jpeg'; // Beach
			case 2:
				return '/images/Alaska-Desktop-Summer.jpeg'; // Mountains
			case 3:
				return '/images/cityscape.jpeg'; // Cityscape
			case 4:
				return '/images/highway.jpeg'; // Road Trip/Highway
			case 5:
				return '/images/desert.jpeg'; // Desert
			case 6:
				return '/images/forest.jpeg'; // Forest
			case 7:
				return '/images/countryside.jpeg'; // Countryside/Farmland
			case 8:
				return '/images/island.jpeg'; // Tropical Island
			case 9:
				return '/images/winter.jpeg'; // Winter Wonderland
			case 10:
				return '/images/landmarks.jpeg'; // Historical/Landmarks
			case 11:
				return '/images/themepark.jpeg'; // Theme Parks
			default:
				return '/images/generic.jpeg'; // Fallback
		}
	};

	useEffect(() => {
		if (currentTrip && currentTrip.category_id) {
			const categoryImage = getCategoryBackground(currentTrip.category_id);
			setBackgroundImage(categoryImage);
		} else if (trips.length > 0) {
			const nextTrip = trips[0]; // Assuming trips are sorted by date, the next trip is at index 0
			const categoryImage = getCategoryBackground(nextTrip.category_id);
			setBackgroundImage(categoryImage); // Set the background image based on the category
		}
	}, [trips, currentTrip]);

	return (
		<Router>
			<div
				style={{
					backgroundImage: `url(${backgroundImage})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					minHeight: '100vh',
				}}
			>
				<Nav />
				<Routes>
					<Route path='/' element={<LandingPage />} />
					<Route path='/about' element={<AboutPage />} />
					<Route path='/user' element={<ProtectedRoute />}>
						<Route path='/user' element={<UserPage />} />
					</Route>
					<Route path='/info' element={<ProtectedRoute />}>
						<Route path='/info' element={<InfoPage />} />
					</Route>
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/trips' element={<ProtectedRoute />}>
						<Route path='/trips' element={<Trips />} />
					</Route>
					<Route path='/edit-create-trips' element={<ProtectedRoute />}>
						<Route path='/edit-create-trips' element={<EditCreateTrips />} />
					</Route>
					<Route path='/create-daily-itinerary' element={<ProtectedRoute />}>
						<Route path='/create-daily-itinerary' element={<DailyItinerary />} />
					</Route>
					<Route path='/packing-list/:tripId' element={<ProtectedRoute />}>
						<Route path='/packing-list/:tripId' element={<PackingList />} />
					</Route>
					<Route path='/map-page' element={<ProtectedRoute />}>
						<Route path='/map-page' element={<MapPage />} />
					</Route>
					<Route path='/past-trips' element={<ProtectedRoute />}>
						<Route path='/past-trips' element={<PastTrips />} />
					</Route>
					<Route path='/checklist/:tripId' element={<ProtectedRoute />}>
						<Route path='/checklist/:tripId' element={<ChecklistComponent />} />
					</Route>
					<Route path='/admin' element={<AdminRoute />}>
						<Route path='/admin' element={<AdminPage />} />
					</Route>
					<Route path='/non-admin-landing' element={<NonAdminLanding />} />
					<Route path='/trip-details/:tripId' element={<ProtectedRoute />}>
						<Route path='/trip-details/:tripId' element={<TripDetails />} />
					</Route>
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
