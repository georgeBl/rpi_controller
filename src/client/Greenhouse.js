import React, {Component} from 'react';

// importing components
import Controller from './Controller.js';
import LiveStats from './LiveStats.js';

import $ from 'jquery';


export default class Greenhouse extends Component {

  updateStats(doc) {
    this.props.updateStats(doc);
  }

  deleteThisGreenhouse() {
    this.props.deleteGreenhouse(this.props.id);
  }

  render() {
    return(
      <div>
        <div className='row'>
          <div className='col-12 text-centered'>
            <h1>
              {this.props.name}
            </h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-6'>
            <LiveStats
              status = {this.props.liveStats.status}
              temperature = {this.props.liveStats.temperature}
              humidityLevel = {this.props.liveStats.humidity}
              lightLevel = {this.props.liveStats.light_level}
              onlineTime = {10}
              lightsInUse = {this.props.liveStats.lights_in_use}
              ventInUse = {this.props.liveStats.vent_in_use}
              heaterInUse = {this.props.liveStats.heater_in_use}
              updateStats = {this.updateStats.bind(this)}
            />
          </div>
          <div className='col-6'>
            <Controller
              name = {this.props.name}
              key = {this.props.id}
              controls = {this.props.controls}
              imageUrl = {this.props.imageUrl}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <button className="btn btn-large btn-danger" onClick={this.deleteThisGreenhouse.bind(this)}>Unassign Greenhouse</button>
          </div>
        </div>
      </div>
    );
  }
}
