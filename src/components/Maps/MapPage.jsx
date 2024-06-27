import React, { Component } from 'react';
import MapForm from './MapForm';
import Map from './Map';
import MapInfo from './MapInfo';
import { connect } from 'react-redux';
import './MapPage.css';

class MapPage extends Component {
    componentDidMount = () => {
        // fetch all the map items
        this.props.dispatch({ type: 'FETCH_MAP_ITEMS' });
    }
    render = () => {
        return (
            <>
                <h1 className='summer'>WanderWise Mapping</h1>
                <p className='summer'>This is the map that displays available points when adding itineraries.
                    You can add map pins to the map below.</p>
                <Map />
                <MapInfo />
                <MapForm />
            </>
        );
    }
};

export default connect()(MapPage);