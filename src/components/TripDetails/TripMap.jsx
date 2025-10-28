// TripMap.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from 'react-bootstrap';
import bbox from '@turf/bbox';
import { featureCollection, point } from '@turf/helpers';

// If the file lives in /public/images/Eye_4.png, reference it as an absolute path:
const eyeMarkerIcon = '/images/Eye_4.png';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Vite-style env var

const TripMap = ({ tripId, getCursor: getCursorProp, onMarkerClick }) => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location.locations) || [];
  const itineraries = useSelector((state) => state.itineraries.itineraries) || [];

  // Controlled view state (react-map-gl 7+)
  const [viewState, setViewState] = useState({
    latitude: 46.8772,
    longitude: -96.7898,
    zoom: 10
  });

  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const mapRef = useRef(null);

  // Compute bounds from locations
  const bounds = useMemo(() => {
    if (!locations.length) return null;
    const points = featureCollection(
      locations
        .filter((l) => l?.latitude && l?.longitude)
        .map((l) => point([Number(l.longitude), Number(l.latitude)]))
    );
    const [minLng, minLat, maxLng, maxLat] = bbox(points);
    return [[minLng, minLat], [maxLng, maxLat]];
  }, [locations]);


 const cursorFn = getCursorProp ?? ((state) => {
    if (state?.isDragging) return 'grabbing';
    if (state?.isHovering) return 'pointer';
    return 'grab';
  });


  // Fit to bounds when locations change
  useEffect(() => {
    if (!mapRef.current || !bounds) return;

    // If all points are the same, just set a reasonable zoom and center
    const [[minLng, minLat], [maxLng, maxLat]] = bounds;
    const singlePoint = minLng === maxLng && minLat === maxLat;

    if (singlePoint) {
      setViewState((vs) => ({
        ...vs,
        longitude: minLng,
        latitude: minLat,
        zoom: 14
      }));
    } else {
      mapRef.current.fitBounds(bounds, { padding: 40, duration: 1000 });
    }
  }, [bounds]);

  // If itineraries load, fetch locations for this trip
  useEffect(() => {
    if (itineraries.length > 0 && tripId) {
      dispatch({ type: 'FETCH_LOCATIONS', payload: tripId });
    }
  }, [itineraries, tripId, dispatch]);

  const handleMarkerClick = (location) => {
    let matched = itineraries.find(
      (itinerary) => String(itinerary.itinerary_id) === String(location.itinerary_id)
    );

    if (!matched) {
      matched = itineraries.find(
        (itinerary) =>
          Number(itinerary.latitude) === Number(location.latitude) &&
          Number(itinerary.longitude) === Number(location.longitude)
      );
    }

    if (matched) {
      setSelectedItinerary({
        ...matched,
        latitude: location.latitude,
        longitude: location.longitude
      });
    } else {
      setSelectedItinerary({
        latitude: location.latitude,
        longitude: location.longitude,
        location: 'No details available',
        activity: 'Activity not found',
        notes: 'No additional notes'
      });
    }
  };

  const handleCloseCard = () => setSelectedItinerary(null);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      style={{ width: '100%', height: 400 }}
      viewState={viewState}
      onMove={(evt) => setViewState(evt.viewState)}
	  getCursor={cursorFn}
	  touchAction="pan-y"     // or "none" if you prefer to disable page scroll on touch
	  dragPan={true}
	  dragRotate={false}
	  onResize={() => {}}  
    >
      {Array.isArray(locations) &&
        locations.map((location, idx) => {
          const lat = Number(location.latitude);
          const lng = Number(location.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

          return (
            <Marker key={idx} latitude={lat} longitude={lng} anchor="bottom">
              <img
                src={eyeMarkerIcon}
                alt="Selection marker"
                style={{ width: 25, height: 25, cursor: 'pointer' }}
                 onClick={() => { onMarkerClick?.(location); handleMarkerClick(location); }}
              />
            </Marker>
          );
        })}

      {selectedItinerary && (
        <Popup
          longitude={Number(selectedItinerary.longitude)}
          latitude={Number(selectedItinerary.latitude)}
          closeButton
          closeOnClick={false}
          onClose={handleCloseCard}
          anchor="top"
        >
          <Card style={{ width: 200, padding: 10 }}>
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
    </Map>
  );
};

export default TripMap;
