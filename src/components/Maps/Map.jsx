import React, { useState, useEffect } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import markerIcon from '../../../images/Globe_4.png';

const SimpleMap = ({ markers = [], onItemClick }) => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '400px',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const mapboxToken = process.env.REACT_APP_MAPBOX_API_KEY;

  useEffect(() => {
    console.log('Markers:', markers); // Log the markers to verify data
  }, [markers]);

  if (!mapboxToken) {
    return <div>Error: Mapbox token is missing</div>;
  }

  return (
    <div className="map-container" style={{ width: '100%', height: '400px' }}>
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={mapboxToken}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            latitude={parseFloat(marker.latitude)}
            longitude={parseFloat(marker.longitude)}
          >
            <img
              src={markerIcon} // Place selection icon
              alt="Selection marker"
              style={{
                width: '25px',
                height: '25px',
                cursor: 'pointer',
              }}
              onClick={() => onItemClick(marker)}
            />
          </Marker>
        ))}
      </MapGL>
    </div>
  );
};

export default SimpleMap;