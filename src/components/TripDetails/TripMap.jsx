import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from 'react-bootstrap';
import bbox from '@turf/bbox';
import { featureCollection, point } from '@turf/helpers';
import eyeMarkerIcon from '../../../images/Eye_4.png';
import { WebMercatorViewport } from 'react-map-gl';

const TripMap = ({ tripId }) => {
	const dispatch = useDispatch();

	const locations = useSelector((state) => state.location.locations) || [];
	const itineraries = useSelector((state) => state.itineraries.itineraries) || [];
	// console.log("Itineraries in TripMap:", itineraries);

	const [viewport, setViewport] = useState({
		latitude: 46.8772, // Initial location as a fallback
		longitude: -96.7898,
		zoom: 10,
		width: '100%',
		height: '400px',
	});
	const [selectedItinerary, setSelectedItinerary] = useState(null);

	// Adjust viewport to fit all markers on load
	useEffect(() => {
    if (locations.length > 0) {
      const points = featureCollection(
        locations.map((location) => point([parseFloat(location.longitude), parseFloat(location.latitude)]))
      );
      const [minLng, minLat, maxLng, maxLat] = bbox(points);
  
      // Calculate latitude and longitude center
      const latitude = (minLat + maxLat) / 2;
      const longitude = (minLng + maxLng) / 2;
  
      // Determine the zoom level to fit all markers
      const viewportWidth = window.innerWidth;
      const viewportHeight = 400; // height in pixels
      const padding = 40; // Extra padding around the markers
      const bounds = [
        [minLng, minLat],
        [maxLng, maxLat],
      ];
  
      const { longitude: newLongitude, latitude: newLatitude, zoom } = new WebMercatorViewport({
        width: viewportWidth,
        height: viewportHeight,
      }).fitBounds(bounds, { padding });
  
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: newLatitude,
        longitude: newLongitude,
        zoom,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    }
  }, [locations]);

  useEffect(() => {
    if (itineraries.length > 0) {
      dispatch({ type: 'FETCH_LOCATIONS', payload: tripId });
    }
  }, [itineraries, tripId, dispatch]);

	const handleMarkerClick = (location) => {
		console.log('Clicked location:', location);

		// Try matching directly by itinerary_id first
		let matchedItinerary = itineraries.find(
			(itinerary) => String(itinerary.itinerary_id) === String(location.itinerary_id)
		);

		// Fallback to matching by coordinates if itinerary_id is not available or no match found
		if (!matchedItinerary) {
			matchedItinerary = itineraries.find(
				(itinerary) =>
					parseFloat(itinerary.latitude) === parseFloat(location.latitude) &&
					parseFloat(itinerary.longitude) === parseFloat(location.longitude)
			);
		}

		console.log('Matched itinerary:', matchedItinerary);

		if (matchedItinerary) {
			setSelectedItinerary({
				...matchedItinerary,
				latitude: location.latitude,
				longitude: location.longitude,
			});
		} else {
			console.warn('No matching itinerary found for location:', location);
			setSelectedItinerary({
				latitude: location.latitude,
				longitude: location.longitude,
				location: 'No details available',
				activity: 'Activity not found',
				notes: 'No additional notes',
			});
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
			mapStyle='mapbox://styles/mapbox/streets-v11'
		>
			{Array.isArray(locations) &&
				locations.map((location, index) => {
					const { latitude, longitude } = location;
					return (
						<Marker key={index} latitude={parseFloat(latitude)} longitude={parseFloat(longitude)}>
							<img
								src={eyeMarkerIcon} // Place selection icon
								alt='Selection marker'
								style={{
									width: '25px',
									height: '25px',
									cursor: 'pointer',
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
					anchor='top'
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
