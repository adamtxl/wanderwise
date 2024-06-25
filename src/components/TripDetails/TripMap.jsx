import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxToken = process.env.REACT_APP_MAPBOX_API_KEY;

const TripMap = () => {
    const dispatch = useDispatch();
    const { trip_id } = useParams();
    const locations = useSelector((state) => state.location.locations);

    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: 40.813600, // Default coordinates
        longitude: -96.789803,
        zoom: 4
    });

    useEffect(() => {
        dispatch({ type: 'FETCH_LOCATIONS', payload: trip_id });
    }, [dispatch, trip_id]);



    return (
        <div className="map-container">
            <ReactMapGL
               {...viewport}
               mapboxApiAccessToken={mapboxToken}
               mapStyle="mapbox://styles/mapbox/streets-v11"
               onViewportChange={(newViewport) => setViewport(newViewport)}
            >
               {locations.map(location => (
                  <Marker
                     key={location.id}
                     latitude={Number(location.latitude)}
                     longitude={Number(location.longitude)}
                     offsetLeft={-15}
                     offsetTop={-40}
                  >
                     <div className='map-marker'>
                        <img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png' alt={location.description} />
                     </div>
                  </Marker>
               ))}
            </ReactMapGL>
         </div>
    );
};

export default connect()(TripMap);
