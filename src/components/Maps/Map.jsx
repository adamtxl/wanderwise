import React, { useState } from 'react';
import MapGL, { Marker } from 'react-map-gl';

const SimpleMap = ({ markers = [] }) => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const mapboxToken = process.env.REACT_APP_MAPBOX_API_KEY;

  return (
    <MapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken={mapboxToken}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {markers.map((marker, index) => (
        <Marker key={index} latitude={marker.lat} longitude={marker.lng}>
          <div>{marker.name}</div>
        </Marker>
      ))}
    </MapGL>
  );
};

export default SimpleMap;