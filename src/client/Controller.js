import React, {Component} from 'react';

import $ from 'jquery';
import axios from 'axios';

export default class Controller extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.controls;
  }

  getImage(evt) {
    window.open(this.props.imageUrl, '_blank');
  }

  onToggle(evt) {
    const
      lightsToggle = $('#lightsToggle').is(':checked'),
      heaterToggle = $('#heaterToggle').is(':checked'),
      ventToggle = $('#ventToggle').is(':checked'),
      hoursOfLight = $('#hoursOfLight').val(),
      chosenTemperature = $('#chosenTemperature').val(),
      chosenLightLevel = $('#chosenLightLevel').val(),
      chosenHumidityLevel = $('#chosenHumidityLevel').val();

    this.setState({[evt.target.name]:evt.target.value});
    if(hoursOfLight > 24) {
      hoursOfLight = 24;
    }
    if(chosenTemperature > 40) {
      chosenTemperature = 40;
    }
    axios({
      method:'put',
      url: '/api/greenhousecontrols',
      headers: {'Authorization': 'bearer ' + localStorage.getItem('token')},
      data: {
        name: this.props.name,
        lights_always_on: lightsToggle,
        heater_always_on: heaterToggle,
        vent_always_on: ventToggle,
        hours_of_light: parseInt(hoursOfLight),
        chosen_temperature: parseInt(chosenTemperature),
        chosen_light_level: parseInt(chosenLightLevel),
        chosen_humidity_level: parseInt(chosenHumidityLevel)
      },
      json: true
    });
  }
  render() {

    return(
      <div>
        <div className='row bg-light'>
          <div className='col align-text-bottom'>
            <span className='align-bottom'>Lights always on</span>
          </div>
          <div className='col'>
            <label className='switch'>
              <input
                id='lightsToggle'
                type='checkbox'
                name='lights_always_on'
                defaultChecked={this.state.lights_always_on}
                onChange={this.onToggle.bind(this)}
              />
              <span className='slider round'></span>
            </label>
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col align-text-bottom'>
            <span className='align-bottom'>Turn on vent</span>
          </div>
          <div className='col'>
            <label className='switch'>
              <input
                id='ventToggle'

                type='checkbox'
                name='vent_always_on'
                defaultChecked={this.state.vent_always_on}
                onChange={this.onToggle.bind(this)}
              />
              <span className='slider round'></span>
            </label>
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col align-text-bottom'>
            <span className='align-bottom'>Turn on heater</span>
          </div>
          <div className='col'>
            <label className='switch'>
              <input
                id='heaterToggle'
                type='checkbox'
                name='heater_always_on'
                defaultChecked={this.state.heater_always_on}
                onChange={this.onToggle.bind(this)}
              />
              <span className='slider round'></span>
            </label>
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col align-text-bottom'>
            <span className='align-bottom'>Hours of light</span>
          </div>
          <div className='col'>
            <input
              id='hoursOfLight'
              type='number'
              className='form-control'
              name='hours_of_light'
              value={this.state.hours_of_light}
              onChange={this.onToggle.bind(this)}
            />
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col align-text-bottom'>
            <span className='align-bottom'>Desired Temperature</span>
          </div>
          <div className='col'>
            <input
              id='chosenTemperature'
              type='number'
              className='form-control'
              name='chosen_temperature'
              value={this.state.chosen_temperature}
              onChange={this.onToggle.bind(this)}
            />
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col align-text-bottom'>
            <span className='align-bottom'>Chosen Light level</span>
          </div>
          <div className='col'>
            <input
              id='chosenLightLevel'
              type='range'
              className='form-control-range'
              min='1'
              max='100'
              name='chosen_light_level'
              value={this.state.chosen_light_level}
              onChange={this.onToggle.bind(this)}
            />
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col align-text-bottom'>
            <span className='align-bottom'>Chosen Humidity level</span>
          </div>
          <div className='col'>
            <input
              id='chosenHumidityLevel'
              type='range'
              className='form-control-range'
              min='1'
              max='100'
              name='chosen_humidity_level'
              value={this.state.chosen_humidity_level}
              onChange={this.onToggle.bind(this)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <button className='btn btn-primary' onClick={this.getImage.bind(this)}>Get a live image of the greenhouse</button>
          </div>
        </div>
      </div>
    );
  }
}
