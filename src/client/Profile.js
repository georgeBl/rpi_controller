import React, {Component} from 'react';

import $ from 'jquery';
import axios from 'axios';

export default class Profile extends Component {

  state = {greenhouseNames:[]};

  changeName() {
    const name = $('#name').val();
    // validation
    this.props.handleChangeName(name);
  }

  changeNumber() {
    const number = $('#number').val();
    // validation
    this.props.handleChangeNumber(number);
  }

  changeAddress() {
    const address = $('#address').val();
    this.props.handleChangeAddress(address);
  }

  changePassword() {
    const oldPassword = $('#oldPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmNewPassword = $('#confirmNewPassword').val();
    // validation
    if(newPassword.length === 0 || confirmNewPassword.length ===0 || oldPassword.length === 0) {
      console.log('password fields can\'t be empty');
    }
    else if(newPassword === confirmNewPassword) {
      this.props.handleChangePassword(oldPassword, newPassword);
        $('#oldPassword').val('');
        $('#newPassword').val('');
        $('#confirmNewPassword').val('');
    } else {
      console.log('passwords don\'t match');
    }

  }

  componentDidMount() {
    const config = {
      headers: {'Authorization': 'bearer ' + localStorage.getItem('token')}
    };
    axios.get('/api/getgreenhouses', config)
      .then(res=>{
        const names = res.data.map(g=>g.name);
        this.setState({greenhouseNames: names});
      }).catch(err=>console.log(err));

    $('#oldPassword').val('');
    $('#newPassword').val('');
    $('#confirmNewPassword').val('');
  }

  render() {
    let greenhousesList = [];
    if(this.state.greenhouseNames.length === 0) {
      greenhousesList = () => (
        <tr>
          <td>Greenhouses</td>
          <td>No greenhouses assigned</td>
        </tr>
      );
    } else {
      greenhousesList = this.state.greenhouseNames.map( n=>(
        <tr>
          <td>Greenhouses</td>
          <td>{n}</td>
        </tr>
      ));
    }

    return(
      <div>
        <div className="row">
          <table className="table">
            <tbody>
              <tr>
                <th scope='col'>Your information</th>
              </tr>
              <tr>
                <td>Name</td>
                <td><input type='text' id='name' defaultValue={this.props.name} /></td>
                <td><button className='btn btn-danger btn-large' onClick={this.changeName.bind(this)}>Change</button></td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.props.email}</td>
              </tr>
              <tr>
                <td>Number</td>
                <td><input type='text' id='number' defaultValue={this.props.number} /></td>
                <td><button className='btn btn-danger btn-large' onClick={this.changeNumber.bind(this)}>Change</button></td>
              </tr>
              <tr>
                <td>Address</td>
                <td><input type='text'  id='address' defaultValue={this.props.address} /></td>
                <td><button className='btn btn-danger btn-large' onClick={this.changeAddress.bind(this)}>Change</button></td>
              </tr>
              <tr>
                <td>Member since</td>
                <td>{this.props.createdOn}</td>
              </tr>
              <tr>
                <td>Admin</td>
                {
                  this.props.admin ? <td>Yes</td> : <td>No</td>
                }
              </tr>
              {greenhousesList}
              <tr>
                <td>Change Password</td>
                <td><input type="password" autoComplete="off" id="oldPassword" placeholder="Old password..."/></td>
                <td><input type="password" autoComplete="off" id="newPassword" placeholder="New password..."/></td>
                <td><input type="password" autoComplete="off" id="confirmNewPassword" placeholder="Rewrite password..."/></td>
                <td><button className="btn btn-danger btn-large" onClick={this.changePassword.bind(this)}>Change</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
