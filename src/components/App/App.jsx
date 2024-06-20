import React, { useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import TripDetails from '../TripDetails/TripDetails';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

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

function App() {
	const dispatch = useDispatch();

	const user = useSelector((store) => store.user);

	useEffect(() => {
		dispatch({ type: 'FETCH_USER' });
	}, [dispatch]);

	return (
		<Router>
			<div>
				<Nav />
				<Switch>
					{/* Visiting localhost:5173 will redirect to localhost:5173/home */}
					<Redirect exact from='/' to='/home' />

					{/* Visiting localhost:5173/about will show the about page. */}
					<Route
						// shows AboutPage at all times (logged in or not)
						exact
						path='/about'
					>
						<AboutPage />
					</Route>

					{/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:5173/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:5173/user */}
					<ProtectedRoute
						// logged in shows UserPage else shows LoginPage
						exact
						path='/user'
					>
						<UserPage />
					</ProtectedRoute>

					<ProtectedRoute
						// logged in shows InfoPage else shows LoginPage
						exact
						path='/info'
					>
						<InfoPage />
					</ProtectedRoute>

					<Route exact path='/login'>
						{user.id ? (
							// If the user is already logged in,
							// redirect to the /user page
							<Redirect to='/user' />
						) : (
							// Otherwise, show the login page
							<LoginPage />
						)}
					</Route>

					<Route exact path='/registration'>
						{user.id ? (
							// If the user is already logged in,
							// redirect them to the /user page
							<Redirect to='/user' />
						) : (
							// Otherwise, show the registration page
							<RegisterPage />
						)}
					</Route>

					<Route exact path='/home'>
						{user.id ? (
							// If the user is already logged in,
							// redirect them to the /user page
							<Redirect to='/user' />
						) : (
							// Otherwise, show the Landing page
							<LandingPage />
						)}
					</Route>
					<ProtectedRoute
						// logged in shows UserPage else shows LoginPage
						exact
						path='/trips'
					>
						<Trips />
					</ProtectedRoute>
					<ProtectedRoute
						// logged in shows TripDetails else shows LoginPage
						path='/trip-details/:trip_id'
						component={TripDetails}
					>
					</ProtectedRoute>
					<ProtectedRoute
						// logged in shows TripDetails else shows LoginPage
						exact
						path='/edit-create-trip'
					>
						<EditCreateTrips />
					</ProtectedRoute>
					<ProtectedRoute
						// logged in shows TripDetails else shows LoginPage
						exact
						path='/create-daily-itinerary'
					>
						<DailyItinerary />
					</ProtectedRoute>
					<ProtectedRoute  path='/packing-list/:tripId/'>
						<PackingList />
					</ProtectedRoute >
					{/* If none of the other routes matched, we will show a 404. */}
					<Route>
						<h1>404</h1>
					</Route>
				</Switch>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
