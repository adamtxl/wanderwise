import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { connect } from 'react-redux';
import 'mapbox-gl/dist/mapbox-gl.css';

// Don't forget to create your own mapbox API key @ mapbox.com
const mapboxToken = process.env.REACT_APP_MAPBOX_API_KEY;

class SimpleMap extends Component {
   state = {
      viewport: {
         width: '100%', // 100% of container, set container in CSS
         height: '100%', // 100% of container, set container in CSS
         latitude: 46.877186, // Fargo, ND
         longitude: -96.789803,
         zoom: 4
      }
   };

   setCurrentItem = (item) => {
      // When a marker is clicked, just set redux to whatever was clicked on
      this.props.dispatch({ type: 'SET_CURRENT_ITEM', payload: item });
      // Call the callback function passed via props to update the parent component
      this.props.onItemClick(item);
   };

   render() {
      return (
         <div className="map-container">
            <ReactMapGL
               {...this.state.viewport}
               mapboxApiAccessToken={mapboxToken}
               mapStyle="mapbox://styles/mapbox/streets-v11"
               onViewportChange={(viewport) => this.setState({ viewport })}
            >
               {this.props.items.map(item => (
                  <Marker
                     key={item.id}
                     latitude={Number(item.latitude)}
                     longitude={Number(item.longitude)}
                     offsetLeft={-15}
                     offsetTop={-40}
                  >
                     <div className='map-marker' onClick={() => this.setCurrentItem(item)}>
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
