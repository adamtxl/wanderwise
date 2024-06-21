import React, { Component } from 'react';
import MapForm from './MapForm';
import Map from './Map';
import MapInfo from './MapInfo';
import { connect } from 'react-redux';

class MapPage extends Component {
    componentDidMount = () => {
        // fetch all the map items
        this.props.dispatch({ type: 'FETCH_MAP_ITEMS' });
    }
    render = () => {
        return (
            <>
                <h1>Mapbox GL Demo</h1>
                <Map />
                <MapInfo />
                <MapForm />
            </>
        );
    }
};

export default connect()(MapPage);