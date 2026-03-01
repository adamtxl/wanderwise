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
    const { mapItems } = this.props;

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
          {mapItems.length > 0 && (
            <div className="mappage-pin-count">
              {mapItems.length} pin{mapItems.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Map — centered on continental US, all pins visible */}
        <div className="mappage-map-container">
          <Map
            markers={mapItems}
            initialViewState={{
              latitude: 39.5,
              longitude: -98.35,
              zoom: 3.5,
            }}
            style={{ width: '100%', height: '100%' }}
            onItemClick={(item) => this.props.dispatch({ type: 'SET_CURRENT_ITEM', payload: item })}
          />
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

const mapStateToProps = (state) => ({
  mapItems: state.mapItems.items || [],
});

export default connect(mapStateToProps)(MapPage);
