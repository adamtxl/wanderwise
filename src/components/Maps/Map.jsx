// ../Maps/Map.jsx
import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import mapboxgl from 'mapbox-gl'; // optional global fallback

const markerIcon = '/images/Globe_4.png';

export default function AppMap({
  // ✅ pass the token in from the parent OR fall back to Vite env
  mapboxAccessToken: tokenProp,
  viewState,
  onMove,
  getCursor,
  touchAction = 'pan-y',
  dragPan = true,
  dragRotate = false,
  mapStyle = 'mapbox://styles/mapbox/streets-v11',
  style = { width: '100%', height: 400 },
  markers = [],
  onItemClick,
  initialViewState = { latitude: 46.8772, longitude: -96.7898, zoom: 10 },
  onResize = () => {},
  ...rest
}) {
  const token = (tokenProp ?? import.meta.env.VITE_MAPBOX_TOKEN)?.trim?.();

  // Helpful debug: remove after verifying
  // console.log('Wrapper sees token?', !!token, token?.slice(0, 12));

  if (!token) {
    return (
      <div style={{ padding: 8, color: 'crimson' }}>
        Mapbox token missing. Provide <code>mapboxAccessToken</code> prop or set <code>VITE_MAPBOX_TOKEN</code> in
        <code>.env.local</code>, then restart dev server.
      </div>
    );
  }

  // Optional: also set the global for any libraries that read it
  mapboxgl.accessToken = token;

  // Controlled vs uncontrolled support
  const isControlled = !!viewState && !!onMove;
  const [internalView, setInternalView] = useState(initialViewState);
  const vs = isControlled ? viewState : internalView;
  const handleMove = isControlled ? onMove : (e) => setInternalView(e.viewState);

  const cursorFn = getCursor ?? ((s) => (s?.isDragging ? 'grabbing' : s?.isHovering ? 'pointer' : 'grab'));

  return (
    <Map
      mapboxAccessToken={token}     
      mapStyle={mapStyle}
      style={style}
      viewState={vs}
      onMove={handleMove}
      getCursor={cursorFn}
      touchAction={touchAction}
      dragPan={dragPan}
      dragRotate={dragRotate}
      onResize={onResize}
      {...rest}
    >
      {Array.isArray(markers) &&
        markers.map((m, i) => {
          const lat = Number(m.latitude), lng = Number(m.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
          return (
            <Marker key={m.id ?? i} latitude={lat} longitude={lng} anchor="bottom">
              <img
                src={markerIcon}
                alt="marker"
                style={{ width: 24, height: 24, cursor: 'pointer' }}
                onClick={() => onItemClick?.(m)}
              />
            </Marker>
          );
        })}
    </Map>
  );
}