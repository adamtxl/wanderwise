import React, { useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
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

function App() {
    const dispatch = useDispatch();

    const user = useSelector((store) => store.user);

    useEffect(() => {
        dispatch({ type: 'FETCH_USER' });
    }, [dispatch]);

    return (
        <Router>
            <div id="root">
                <div className="App">
                    <Nav />
                    <div className="content">
                        <Switch>
                            <Redirect exact from='/' to='/home' />
                            <Route exact path='/about'>
                                <AboutPage />
                            </Route>
                            <ProtectedRoute exact path='/user'>
                                <UserPage />
                            </ProtectedRoute>
                            <ProtectedRoute exact path='/info'>
                                <InfoPage />
                            </ProtectedRoute>
                            <Route exact path='/login'>
                                {user.id ? (
                                    <Redirect to='/trips' />
                                ) : (
                                    <LoginPage />
                                )}
                            </Route>
                            <Route exact path='/registration'>
                                {user.id ? (
                                    <Redirect to='/info' />
                                ) : (
                                    <RegisterPage />
                                )}
                            </Route>
                            <Route exact path='/home'>
                                {user.id ? (
                                    <Redirect to='/trips' />
                                ) : (
                                    <LandingPage />
                                )}
                            </Route>
                            <ProtectedRoute exact path='/trips'>
                                <Trips />
                            </ProtectedRoute>
                            <ProtectedRoute exact path='/past-trips'>
                                <PastTrips />
                            </ProtectedRoute>
                            <ProtectedRoute path='/trip-details/:trip_id' component={TripDetails} />
                            <ProtectedRoute exact path='/edit-create-trip'>
                                <EditCreateTrips />
                            </ProtectedRoute>
                            <ProtectedRoute exact path='/create-daily-itinerary'>
                                <DailyItinerary />
                            </ProtectedRoute>
                            <ProtectedRoute path='/packing-list/:tripId/'>
                                <PackingList />
                            </ProtectedRoute>
                            <ProtectedRoute path='/map/'>
                                <MapPage />
                            </ProtectedRoute>
                            <AdminRoute path='/admin/'>
                                <AdminPage />
                            </AdminRoute>
                            <Route>
                                <h1>404</h1>
                            </Route>
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </div>
        </Router>
    );
}

export default App;
