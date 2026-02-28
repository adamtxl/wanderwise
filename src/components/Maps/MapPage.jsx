import React, { Component } from 'react';
import MapForm from './MapForm';
import Map from './Map';
import MapInfo from './MapInfo';
import { connect } from 'react-redux';
import './MapPage.css';

class MapPage extends Component {
  componentDidMount = () => {
    this.props.dispatch({ type: 'FETCH_MAP_ITEMS' });
  }

  render = () => {
    return (
      <div className="mappage-wrapper">
        {/* Header */}
        <div className="mappage-header">
          <div>
            <div className="mappage-eyebrow">Navigation</div>
            <h1 className="mappage-title">Map Your Journey</h1>
            <p className="mappage-subtitle">
              Pin your destinations and points of interest. Click any marker to view details.
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="mappage-map-container">
          <Map />
        </div>

        {/* Info + Form row */}
        <div className="mappage-bottom">
          <div className="mappage-info-panel">
            <MapInfo />
          </div>
          <div className="mappage-form-panel">
            <MapForm />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(MapPage);
