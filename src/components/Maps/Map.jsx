import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { connect } from 'react-redux';
import 'mapbox-gl/dist/mapbox-gl.css';

// Don't forget to create your own mapbox API key @ mapbox.com
// const mapboxToken = process.env.REACT_APP_MAPBOX_API_KEY;

class SimpleMap extends Component {
   state = {
      viewport: {
         width: '100%', // 100% of container, set container in CSS
         height: '100%', // 100% of container, set container in CSS
         latitude: 46.877186, // Fargo, ND
         longitude: -96.789803,
         zoom: 10
      }
   };

   setCurrentItem = (item) => {
      // When a marker is clicked, just set redux to whatever was clicked on
      this.props.dispatch({ type: 'SET_CURRENT_ITEM', payload: item })
   }

   render() {
      return (
         <div className="map-container">
            <ReactMapGL
               {...this.state.viewport}
            //    mapboxApiAccessToken={mapboxToken}
               // mapStyle="mapbox://styles/mapbox/dark-v9"
               mapStyle="mapbox://styles/mapbox/streets-v11"
               // This is from the react-map-gl examples. It updates our local state with
               // whatever the new map viewport is, after a user zooms or pans
               onViewportChange={(viewport) => this.setState({ viewport })}
            >
               {this.props.items.map(item => (
                  // Offset is required because images are drawn on the map at the top left corner... 
                  // but marker pins need to have their bottom 'point' on the location (so they need to
                  // get shifted to the left and up! Depends on the size of the marker)
                  <Marker
                     key={item.id} // Adding a unique key for each marker
                     latitude={Number(item.latitude)}
                     longitude={Number(item.longitude)}
                     offsetLeft={-15}
                     offsetTop={-40}
                  >
                     <div className='map-marker' onClick={() => this.setCurrentItem(item)}>
                        {/* Could also download this locally. Use conditional rendering to change what image
                            is rendered! Green for one type of item, red for another, etc */}
                        <img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png' alt={item.description}/>
                     </div>
                  </Marker>
               ))}
            </ReactMapGL>
         </div>
      );
   }
}

const mapStateToProps = (state) => ({
   items: state.mapItems.items
});

export default connect(mapStateToProps)(SimpleMap);
