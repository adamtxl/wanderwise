import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapForm extends Component {
  state = {
    title: '',
    description: '',
    latitude: '',
    longitude: '',
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.dispatch({
      type: 'CREATE_MAP_ITEM',
      payload: this.state
    });
    this.setState({ title: '', description: '', latitude: '', longitude: '' });
  }

  render = () => {
    return (
      <div className="mapform-wrapper">
        <div className="mapform-heading">
          <span className="mapform-icon">◈</span>
          Add a Pin
        </div>
        <p className="mapform-hint">
          Need coordinates?{' '}
          <a href="https://www.latlong.net/" target="_blank" rel="noreferrer" className="mapform-link">
            LatLong.net ↗
          </a>
        </p>
        <form onSubmit={this.onSubmit} className="mapform-form">
          <div className="mapform-field">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Cruise Terminal, Hotel"
              onChange={(e) => this.setState({ title: e.target.value })}
              value={this.state.title}
              required
            />
          </div>
          <div className="mapform-field">
            <label>Description</label>
            <input
              type="text"
              placeholder="Brief note about this location"
              onChange={(e) => this.setState({ description: e.target.value })}
              value={this.state.description}
              required
            />
          </div>
          <div className="mapform-coords">
            <div className="mapform-field">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="46.8772"
                onChange={(e) => this.setState({ latitude: e.target.value })}
                value={this.state.latitude}
                required
              />
            </div>
            <div className="mapform-field">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="-96.7898"
                onChange={(e) => this.setState({ longitude: e.target.value })}
                value={this.state.longitude}
                required
              />
            </div>
          </div>
          <button type="submit" className="mapform-submit">
            Add Pin →
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(MapForm);
