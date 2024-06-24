import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapInfo extends Component {
    render = () => {
        // if there is no currentItem in redux, just return a message
        // instead of digging into it
        if (!this.props.currentItem) {
            return <h2 className='white-black'>No item selected. Please click a marker on the map</h2>
        }
        return (
            <>
                <h2 className='white-black'>Selected Map Item</h2>
                <h3 className='white-black'>{this.props.currentItem.title}</h3>
                <p className='white-black'>{this.props.currentItem.description}</p>
                <p className='white-black'>{this.props.currentItem.latitude}, {this.props.currentItem.longitude}</p>
            </>
        );
    }
};
const mapStateToProps = (state) => ({
    currentItem: state.mapItems.currentItem
});
export default connect(mapStateToProps)(MapInfo);