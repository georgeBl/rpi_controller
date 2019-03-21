import React, {Component} from 'react';

export default class Home extends Component {
  render() {
    return(
      <div>
        <div className='row'>
          <div className='col'>
            {
              (this.props.isAuth && this.props.name) ?  (
                <div>
                  <h1>Welcome, {this.props.name} !</h1>
                  <h3>This website allows you to control your greenhouses by adjusting the settings so your plants grow as you preferred. </h3>
                  <h4>Click on the dashboard to view and edit your greenhouse!</h4>
                  <h4>Click on your name on the navbar in order to see and edit your details!</h4>
                </div>
              ) : (
                <div>
                  <h1> Welcome stranger!</h1>
                  <h3>This website allows you to control the greenhouses by adjusting the settings so your plants grow as you preferred. </h3>
                  <h3>Sign in or Sign up in order to access the greenhouses. </h3>
                </div>
              )


            }
          </div>
        </div>
      </div>
    );
  }
}
