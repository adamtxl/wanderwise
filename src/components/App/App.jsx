import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
import Map from '../Maps/Map';
import MapPage from '../Maps/MapPage';
import PastTrips from '../Trips/PastTrips';
import AdminPage from '../AdminPage/AdminPage';
import NonAdminLanding from '../AdminPage/NonAdminLanding';

function App() {
    const dispatch = useDispatch();
    const trips = useSelector((state) => state.trip.trips || []);  // Fetch trips from the store
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        dispatch({ type: 'FETCH_USER' });  // Fetch the user's session when the app loads
        dispatch({ type: 'FETCH_TRIPS' }); // Fetch trips when the app loads
    }, [dispatch]);

    // Function to map category_id to a background image
	const getCategoryBackground = (category_id) => {
		switch (category_id) {
			case 1: // Beach
				return '/images/beach.jpeg'; // Use the generated beach image
			case 2: // Mountains
				return '/images/Alaska-Desktop-Summer.jpeg';
			case 3: // Cityscape
				return '/images/cityscape.jpeg'; // Use the generated cityscape image
			case 4: // Road Trip/Highway
				return '/images/highway.jpeg';
			case 5: // Desert
				return '/images/desert.jpeg';  // Add desert image path here
			case 6: // Forest
				return '/images/forest.jpeg';  // Add forest image path here
			case 7: // Countryside/Farmland
				return '/images/countryside.jpeg'; // Add countryside/farmland image path here
			case 8: // Tropical Island
				return '/images/island.jpeg'; // Use or generate a distinct tropical island image
			case 9: // Winter Wonderland
				return '/images/winter.jpeg';  // Add winter image path here
			case 10: // Historical/Landmarks
				return '/images/landmarks.jpeg';  // Add historical landmarks image path here
			case 11: // Theme Parks
				return '/images/themepark.jpeg';  // Add theme park image path here
			default:
				return '/images/generic.jpeg'; // Fallback image
		}
	};

    // Get the upcoming trip and its category
    useEffect(() => {
        if (trips.length > 0) {
            const nextTrip = trips[0];  // Assuming trips are sorted by date, the next trip is at index 0
            const categoryImage = getCategoryBackground(nextTrip.category_id);
            setBackgroundImage(categoryImage);  // Set the background image based on the category
        }
    }, [trips]);

    return (
        <Router>
            <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
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
                    <Route path='/map' element={<ProtectedRoute />}>
                        <Route path='/map' element={<Map />} />
                    </Route>
                    <Route path='/map-page' element={<ProtectedRoute />}>
                        <Route path='/map-page' element={<MapPage />} />
                    </Route>
                    <Route path='/past-trips' element={<ProtectedRoute />}>
                        <Route path='/past-trips' element={<PastTrips />} />
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