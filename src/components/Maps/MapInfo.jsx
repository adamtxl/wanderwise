import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapInfo extends Component {
  render = () => {
    const { currentItem } = this.props;

    if (!currentItem) {
      return (
        <div className="mapinfo-empty">
          <div className="mapinfo-empty-icon">📍</div>
          <div className="mapinfo-empty-text">Click a marker to view details</div>
        </div>
      );
    }

    return (
      <div className="mapinfo-selected">
        <div className="mapinfo-label">Selected Location</div>
        <div className="mapinfo-title">{currentItem.title}</div>
        {currentItem.description && (
          <div className="mapinfo-description">{currentItem.description}</div>
        )}
        <div className="mapinfo-coords">
          <span className="mapinfo-coord-label">Lat</span>
          <span className="mapinfo-coord-value">{Number(currentItem.latitude).toFixed(4)}</span>
          <span className="mapinfo-coord-sep">·</span>
          <span className="mapinfo-coord-label">Lng</span>
          <span className="mapinfo-coord-value">{Number(currentItem.longitude).toFixed(4)}</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentItem: state.mapItems.currentItem
});

export default connect(mapStateToProps)(MapInfo);
