import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, { Marker } from 'react-map-gl';

const TripMap = ({ tripId }) => {
  const dispatch = useDispatch();
  
  const locations = useSelector(state => state.location.locations); // Get locations from Redux
  const loading = useSelector(state => state.location.loading); // Get loading status from Redux
  
  const [viewport, setViewport] = useState({
    latitude: 46.8772, // Default latitude
    longitude: -96.7898, // Default longitude
    zoom: 10,
    width: '100%',
    height: '400px',
  });

  useEffect(() => {
    console.log('Dispatching FETCH_LOCATIONS for tripId:', tripId);
    dispatch({ type: 'FETCH_LOCATIONS', payload: tripId });
  }, [tripId, dispatch]);

  if (loading || locations.length === 0) {
    // Show a loading state or message until the locations are available
    return <div>Loading map...</div>;
  }

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_KEY} // Replace with your Mapbox token
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {locations.map((location, index) => {
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);


        return (
          latitude && longitude ? (
            <Marker
              key={index}
              latitude={latitude}
              longitude={longitude}
            >
              <div style={{ backgroundColor: 'red', width: '10px', height: '10px', borderRadius: '50%' }} />
            </Marker>
          ) : (
            console.warn(`Invalid coordinates for location ${index}:`, location)
          )
        );
      })}
    </ReactMapGL>
  );
};

export default TripMap;