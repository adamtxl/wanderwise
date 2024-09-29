import React from 'react';
import { useEffect } from 'react';
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
  
  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });  // Fetch the user's session when the app loads
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user" element={<ProtectedRoute />}>
            <Route path="/user" element={<UserPage />} />
          </Route>
          <Route path="/info" element={<ProtectedRoute />}>
            <Route path="/info" element={<InfoPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/trips" element={<ProtectedRoute />}>
            <Route path="/trips" element={<Trips />} />
          </Route>
          <Route path="/edit-create-trips" element={<ProtectedRoute />}>
            <Route path="/edit-create-trips" element={<EditCreateTrips />} />
          </Route>
          <Route path="/create-daily-itinerary" element={<ProtectedRoute />}>
            <Route path="/create-daily-itinerary" element={<DailyItinerary />} />
          </Route>
          <Route path="/packing-list" element={<ProtectedRoute />}>
            <Route path="/packing-list" element={<PackingList />} />
          </Route>
          <Route path="/map" element={<ProtectedRoute />}>
            <Route path="/map" element={<Map />} />
          </Route>
          <Route path="/map-page" element={<ProtectedRoute />}>
            <Route path="/map-page" element={<MapPage />} />
          </Route>
          <Route path="/past-trips" element={<ProtectedRoute />}>
            <Route path="/past-trips" element={<PastTrips />} />
          </Route>
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="/non-admin-landing" element={<NonAdminLanding />} />
          <Route path="/trip-details/:tripId" element={<ProtectedRoute />}>
            <Route path="/trip-details/:tripId" element={<TripDetails />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;