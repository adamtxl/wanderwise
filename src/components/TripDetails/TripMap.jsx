import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from 'react-bootstrap';

const TripMap = ({ tripId }) => {
    const dispatch = useDispatch();

    const locations = useSelector((state) => state.location.locations) || []; 
    const itineraries = useSelector((state) => state.itineraries.itineraries) || [];

    const [viewport, setViewport] = useState({
        latitude: 46.8772,
        longitude: -96.7898,
        zoom: 10,
        width: '100%',
        height: '400px',
    });
    const [selectedItinerary, setSelectedItinerary] = useState(null);

    useEffect(() => {
        dispatch({ type: 'FETCH_LOCATIONS', payload: tripId });
    }, [tripId, dispatch]);

    const handleMarkerClick = (location) => {
      console.log("Clicked location:", location);
      console.log("Location itinerary_id (type and value):", typeof location.itinerary_id, location.itinerary_id);
  
      if (itineraries && itineraries.length > 0) {
          // Logging each itinerary's ID and type to diagnose mismatch
          itineraries.forEach(itinerary => {
              console.log("Available itinerary_id (type and value):", typeof itinerary.itinerary_id, itinerary.itinerary_id);
          });
  
          const matchedItinerary = itineraries.find(
              (itinerary) => String(itinerary.itinerary_id) === String(location.itinerary_id)
          );
  
          console.log("Matched itinerary:", matchedItinerary);
  
          if (matchedItinerary) {
              setSelectedItinerary({
                  ...matchedItinerary,
                  latitude: location.latitude,
                  longitude: location.longitude,
              });
          } else {
              console.warn("No matching itinerary found for location:", location);
              setSelectedItinerary({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  location: 'No details available',
                  activity: 'Activity not found',
                  notes: 'No additional notes',
              });
          }
      } else {
          console.warn("Itineraries not loaded or empty:", itineraries);
      }
  };

    const handleCloseCard = () => {
        setSelectedItinerary(null);
    };

    return (
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
        >
            {Array.isArray(locations) && locations.map((location, index) => {
                const { latitude, longitude } = location;
                return (
                    <Marker
                        key={index}
                        latitude={parseFloat(latitude)}
                        longitude={parseFloat(longitude)}
                    >
                        <div
                            style={{
                                backgroundColor: 'red',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleMarkerClick(location)}
                        />
                    </Marker>
                );
            })}

            {selectedItinerary && (
                <Popup
                    longitude={parseFloat(selectedItinerary.longitude)}
                    latitude={parseFloat(selectedItinerary.latitude)}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={handleCloseCard}
                    anchor="top"
                >
                    <Card style={{ width: '200px', padding: '10px' }}>
                        <Card.Title>{selectedItinerary.location || 'Location Details'}</Card.Title>
                        <Card.Text>
                            <strong>Activity:</strong> {selectedItinerary.activity || 'No activity available'}
                        </Card.Text>
                        <Card.Text>
                            <strong>Notes:</strong> {selectedItinerary.notes || 'No notes available'}
                        </Card.Text>
                    </Card>
                </Popup>
            )}
        </ReactMapGL>
    );
};

export default TripMap;