import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
  return images[category_id] || null;
};

function AppShell() {
  const dispatch = useDispatch();
  const trips = useSelector((state) => state.trip.trips || []);
  const [tripsBackground, setTripsBackground] = useState('');
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const isTripsPage = location.pathname === '/trips';

  // Determine next upcoming trip for the trips page background
  useEffect(() => {
    if (trips.length > 0) {
      // trips are already sorted, index 0 is the next trip
      const nextTrip = trips[0];
      const bg = getCategoryBackground(nextTrip.category_id);
      setTripsBackground(bg || '');
    } else {
      // No trips yet — use a beautiful default travel background
      setTripsBackground('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&q=80');
    }
  }, [trips]);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
    dispatch({ type: 'FETCH_TRIPS' });
  }, [dispatch]);

  // Determine background style based on route
  const getBackgroundStyle = () => {
    if (isLanding) {
      // Landing page handles its own background
      return {};
    }
    if (isTripsPage && tripsBackground) {
      // Trips page: next trip category image with strong overlay
      return {
        backgroundImage: `
          linear-gradient(rgba(13,27,42,0.72), rgba(13,27,42,0.72)),
          url(${tripsBackground})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    // All other pages: clean navy — no distraction while working
    return {
      backgroundColor: '#0d1b2a',
    };
  };

  return (
    <div className='app-background' style={getBackgroundStyle()}>
      {!isLanding && <Nav />}
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
      {!isLanding && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
