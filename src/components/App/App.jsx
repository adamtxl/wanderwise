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
	const trips = useSelector((state) => state.trip.trips || []);
	const currentTrip = useSelector((state) => state.tripDetailReducer?.currentTrip?.data);
	const [backgroundImage, setBackgroundImage] = useState('');

	useEffect(() => {
		dispatch({ type: 'FETCH_USER' });
		dispatch({ type: 'FETCH_TRIPS' });
	}, [dispatch]);

	const getCategoryBackground = (category_id) => {
		const images = {
			1: '/images/beach.jpeg',
			2: '/images/Alaska-Desktop-Summer.jpeg',
			3: '/images/cityscape.jpeg',
			4: '/images/highway.jpeg',
			5: '/images/desert.jpeg',
			6: '/images/forest.jpeg',
			7: '/images/countryside.jpeg',
			8: '/images/island.jpeg',
			9: '/images/winter.jpeg',
			10: '/images/landmarks.jpeg',
			11: '/images/themepark.jpeg',
		};
		return images[category_id] || '/images/generic.jpeg';
	};

	useEffect(() => {
		if (currentTrip?.category_id) {
			setBackgroundImage(getCategoryBackground(currentTrip.category_id));
		} else if (trips.length > 0) {
			setBackgroundImage(getCategoryBackground(trips[0].category_id));
		} else {
			setBackgroundImage('/images/globe.jpeg');
		}
	}, [trips, currentTrip]);

	return (
		<Router>
			<div
				className='app-background'
				style={{
					backgroundImage: `url(${backgroundImage}?v=${new Date().getTime()})`,
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
					<Route path='/create-daily-itinerary/:tripId' element={<ProtectedRoute />}>
						<Route path='/create-daily-itinerary/:tripId' element={<DailyItinerary />} />
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