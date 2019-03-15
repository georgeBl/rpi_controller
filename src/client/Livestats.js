import React, {Component} from 'react';

import openSocket from 'socket.io-client';

export default class LiveStats extends Component {



  render() {

    return(
      <div>
        <table className="table">
          <tbody>
            <tr>
              <td>Status</td>
              <td>{this.props.status} </td>
            </tr>
            <tr>
              <td>Temperature</td>
              <td>{this.props.temperature} &#8451;</td>
            </tr>
            <tr>
              <td>Soil Humidity</td>
              <td>{this.props.humidityLevel}%</td>
            </tr>
            <tr>
              <td>Light Level</td>
              <td>{this.props.lightLevel}%</td>
            </tr>
            <tr>
              <td>Time Online</td>
              <td>{this.props.onlineTime}</td>
            </tr>
            <tr>
              <td>Lights on </td>
              <td>{
                (this.props.lightsInUse) ? (<span>Yes</span>) : (<span>No</span>)
              }</td>
            </tr>
            <tr>
              <td>Heater on </td>
              <td>{
                (this.props.heaterInUse) ? (<span>Yes</span>) : (<span>No</span>)
              }</td>
            </tr>
            <tr>
              <td>Vent on </td>
              <td>{
                (this.props.ventInUse) ? (<span>Yes</span>) : (<span>No</span>)
              }</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
