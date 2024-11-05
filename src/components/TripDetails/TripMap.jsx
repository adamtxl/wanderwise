import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, { Marker, FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const TripMap = ({ tripId, onMarkerClick }) => {
  const dispatch = useDispatch();
  const itinerariesWithMapItems = useSelector(state => state.itineraries.itinerariesWithMapItems);
  const locations = useSelector(state => state.location.locations); // Get locations from Redux
  const loading = useSelector(state => state.location.loading); // Get loading status from Redux
  console.log("Locations:", locations);

  const [viewport, setViewport] = useState({
    latitude: 46.8772,
    longitude: -96.7898,
    zoom: 10,
    width: '100%',
    height: '400px',
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_LOCATIONS', payload: tripId });
  }, [tripId, dispatch]);

  useEffect(() => {
    if (tripId) dispatch({ type: 'FETCH_ITINERARIES_WITH_MAP_ITEMS', payload: tripId });
}, [tripId, dispatch]);

  useEffect(() => {
    if (locations && locations.length > 0 && viewport.width && viewport.height) {
      const validLocations = locations.filter(location =>
        !isNaN(parseFloat(location.latitude)) && !isNaN(parseFloat(location.longitude))
      );

      if (validLocations.length === 0) return;

      const latitudes = validLocations.map(location => parseFloat(location.latitude));
      const longitudes = validLocations.map(location => parseFloat(location.longitude));

      const minLatitude = Math.min(...latitudes);
      const maxLatitude = Math.max(...latitudes);
      const minLongitude = Math.min(...longitudes);
      const maxLongitude = Math.max(...longitudes);

      const bounds = [
        [minLongitude, minLatitude],
        [maxLongitude, maxLatitude]
      ];

      try {
        const { width, height } = viewport;
        const { longitude, latitude, zoom } = new WebMercatorViewport({ width, height })
          .fitBounds(bounds, { padding: 50 });

        setViewport(prevViewport => ({
          ...prevViewport,
          latitude,
          longitude,
          zoom: zoom > 0 ? zoom : 1,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        }));
      } catch (error) {
        console.error("Error fitting map bounds:", error);
      }
    }
  }, [locations, viewport.width, viewport.height]);

  if (loading || locations.length === 0) {
    return <div>Loading map...</div>;
  }

  return (
    <ReactMapGL
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
    onViewportChange={nextViewport => setViewport(nextViewport)}
    mapStyle="mapbox://styles/mapbox/streets-v11"
>
    {locations.map((location, index) => {
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {
            return (
                <Marker
                    key={index}
                    latitude={latitude}
                    longitude={longitude}
                >
                    {/* Marker with onClick that passes location to onMarkerClick */}
                    <div
                        style={{
                            backgroundColor: 'red',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                        onClick={() => onMarkerClick(location)}
                    />
                </Marker>
            );
        } else {
            console.warn(`Invalid coordinates for location ${index}:`, location);
            return null;
        }
    })}
</ReactMapGL>
  );
};

export default TripMap;