import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import axios from 'axios';
import $ from 'jquery';

// importing components
import NavBar from './Navbar.js';
import Dashboard from './Dashboard.js';
import SignIn from './Signin.js';
import SignUp from './Signup.js';
import Profile from './Profile.js';
import Home from './Home.js';

import {Link, Redirect, BrowserRouter, Route, Switch, HashRouter} from 'react-router-dom';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth:false,
      greenhouses:[],
      id:'',
      name:'',
      email:'',
      createdOn:'',
      number:'',
      address:'',
      admin:'',
      token:''
    };
    // bind 'this' to the handlers
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
  }

  handleChangePassword(oldPassword, password) {
    const config = {
      headers: {'Authorization': 'bearer ' + localStorage.getItem('token')}
    };
    axios.put('/api/updateuser', {
      oldPassword: oldPassword,
      password: password
    }, config).then(res=>{
      if(res.data.hasOwnProperty('success')) {
        console.log(res.data.message);
      }
    }).catch(err=>console.log(err));
  }

  handleChangeName(name) {
    const config = {
      headers: {'Authorization': 'bearer ' + localStorage.getItem('token')}
    };
    axios.put('/api/updateuser', {
      name: name
    }, config).then(res=>{
      if(res.data.success) {
        this.setState({name:name});
        console.log('name changed');
      }
    }).catch(err=>console.log(err));
  }

  handleChangeNumber(number) {
    const config = {
      headers: {'Authorization': 'bearer ' + localStorage.getItem('token')}
    };
    axios.put('/api/updateuser', {
      number: number
    }, config).then(res=>{
      if(res.data.success) {
        this.setState({number:number});
        console.log('number changed');
      }
    }).catch(err=>console.log(err));
  }

  handleChangeAddress(address) {
    const config = {
      headers: {'Authorization': 'bearer ' + localStorage.getItem('token')}
    };
    axios.put('/api/updateuser', {
      address: address
    }, config).then(res=>{
      if(res.data.success) {
        this.setState({address:address});
        console.log('address changed');
      }
    }).catch(err=>console.log(err));
  }

  getInitialState() {
    const initialState = {
      isAuth:false,
      greenhouses:[],
      id:'',
      name:'',
      email:'',
      createdOn:'',
      number:'',
      address:'',
      admin:'',
      token:''
    };
    return initialState;
  }

  setUserState(userData) {
    this.setState(userData);
    this.setState({isAuth:true});
  }

  handleFormChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  handleSignIn(evt) {
    // prevent defaul refresh from form
    evt.preventDefault();

    // let's try and login the user
    const
      sub_email = $('#signInEmail').val(),
      sub_password = $('#signInPassword').val();

    // validate the values before are send to the api

    // values validated, now get the token from the api
    axios.post('/api/authenticate', {email:sub_email, password:sub_password})
      .then(res => {

        // if the user is not registered
        if(res.data.hasOwnProperty('success')) {
          // send a message to the user with the error provided
          console.log(res.data.message);
        } else {
          this.setState({token:res.data});
          localStorage.setItem('token', res.data);
          const config = {
            headers: {'Authorization': 'bearer ' + res.data}
          };
          // now that we have the token we can ask for the user information
          axios.get('/api/userinfo', config)
            .then(res=>{
              this.setUserState(res.data);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  handleSignUp(evt) {
    // handle the sign up logic
    evt.preventDefault();

    const sub_email = $('#signUpEmail').val();
    const sub_password = $('#signUpPassword').val();
    const sub_name = $('#signUpName').val();
    const sub_confirm_password = $('#signUpConfirmPassword').val();
    if(sub_password !== sub_confirm_password) {
      // if password doesnt match the confirm password let user know, don't register
      console.log('passwords don\'t match');
    } else {
      axios.post('/api/register', {
        email: sub_email,
        password: sub_password,
        name: sub_name
      }). then(res => {
        // console.log(res.data);
        if(res.data.hasOwnProperty('success')) {
          // something happend most probablly user is already registered
          console.log(res.data.message);
        } else {
          this.setState({token:res.data});
          localStorage.clear(); // this might not be needed but, let's leave it there
          localStorage.setItem('token', res.data);
          const config = {
            headers: {'Authorization': 'bearer ' + res.data}
          };
          // now that we have the token we can ask for the user information
          axios.get('/api/userinfo', config)
            .then(res=>{
              this.setUserState(res.data);
            })
            .catch(err => console.log(err));
        }
      }).catch(err => console.log(err));
    }
    // check if the passwords are the same
    // this.setState()
  }

  handleSignOut(evt) {
    this.setState(this.getInitialState());
    localStorage.clear();
  }

  updateUser(ghname) {
    // this.setState({user.greenhouses:});
    console.log(`Greenhouse ${ghname} added`);
    this.setState({
      greenhouses: [...this.state.greenhouses, ghname]
    });
    // console.log(this.state);
  }

  componentDidMount() {
    if(localStorage.getItem('token') !== null) {
      const config = {
        headers: {'Authorization': 'bearer ' + localStorage.getItem('token')}
      };
      axios.get('/api/userinfo', config)
        .then(res=>{
          this.setState({token:localStorage.getItem('token')});
          this.setUserState(res.data);
        })
        .catch(err => console.log(err));
    } else {
      console.log('token inexistent');
    }
  }

  render() {
    return(
      <HashRouter>
        <div>
          <NavBar isAuth={this.state.isAuth} name={this.state.name} handleSignOut={this.handleSignOut} />
          <div className="container">
            <Switch>
              <Route exact path='/' component={() => <Home name={this.state.name} isAuth={this.state.isAuth}/>} />
              <Route path='/home' component={() => (
                this.state.isAuth ? ( <Home name={this.state.name} isAuth={this.state.isAuth}/>
                ) : (
                  <Redirect to='/home' />
                )
              )}/>
              <Route path='/signin' component={() => (
                this.state.isAuth ? ( <Redirect to='/home' />
                ) : (
                  <SignIn  handleSignIn={this.handleSignIn} renderDashboard={this.state.renderDashboard}/>
                )
              )}/>
              <Route path='/signup' component={() => (
                this.state.isAuth ? ( <Redirect to='/home' />
                ) : (
                  <SignUp  handleSignUp={this.handleSignUp} renderDashboard={this.state.renderDashboard}/>
                )
              )}/>
              <Route path='/dashboard' component= {() => (
                this.state.isAuth ? ( <Dashboard token={this.state.token} greenhouses={this.state.greenhouses} updateUser={this.updateUser} />
                ) : (
                  <Redirect to='/signin' />
                )
              )}/>
              <Route path='/profile' component= {() => (
                this.state.isAuth ? ( <Profile
                  name={this.state.name}
                  email={this.state.email}
                  admin={this.state.admin}
                  address={this.state.address}
                  number={this.state.number}
                  createdOn={this.state.createdOn}
                  greenhouses ={this.state.greenhouses}
                  handleChangePassword={this.handleChangePassword}
                  handleChangeName={this.handleChangeName}
                  handleChangeAddress={this.handleChangeAddress}
                  handleChangeNumber={this.handleChangeNumber}

                />
                ) : (
                  <Redirect to='/signin' />
                )
              )}/>
            </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}
// <Route component={NotFound} />


// home will be edited soon







// const Dashboard = (props) => <div> There goes the controller of the green house {props.userInfo && <p>{props.userInfo.name}</p>} </div>;




const Status = () => <div>table with all the current stats from the database of the user </div>;

const NotFound = () => <div> This path is not existant </div>;
