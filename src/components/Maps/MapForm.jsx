import React, { Component } from 'react';
import { connect } from 'react-redux';

class UploadForm extends Component {
   state = {
      title: '',
      description: '',
      latitude: '',
      longitude: '',
   }

   onSubmit = (event) => {
      event.preventDefault();

      // simple dispatch for the saga to take care of
      this.props.dispatch({
         type: 'CREATE_MAP_ITEM',
         payload: this.state
      });

      // clear local state!
      this.setState({
         title: '',
         description: '',
         latitude: '',
         longitude: '',
      })
   }
   render = () => {
      return (
         <>
            <form onSubmit={this.onSubmit}>
               <h2>Create New Map Item</h2>
               <p>Use <a href="https://www.latlong.net/" target="_blank">LatLong.net</a> to get Latitude / Longitude points. After adding the map, the map will auto-update 
               but it will not auto-update to show all pins, but it will be in place</p>
               <br/>Title: <input onChange={(e) => this.setState({ title: e.target.value })} value={this.state.title} required />
               <br/>Description: <input onChange={(e) => this.setState({ description: e.target.value })} value={this.state.description} required />
               <br/>Latitude: <input onChange={(e) => this.setState({ latitude: e.target.value })} value={this.state.latitude} required />
               <br/>Longitude: <input onChange={(e) => this.setState({ longitude: e.target.value })} value={this.state.longitude} required />
               <div>
                  <button type="submit">Create New Map Item</button>
               </div>
            </form>
         </>
      )
   }
}

export default connect()(UploadForm)