import React, {Component} from 'react';
import {Link} from 'react-router-dom';


// navbar
export default class NavBar extends Component {
  render() {
    return(
      <nav className="navbar navbar-light bg-light justify-content-between">
        <Link to='/' className="navbar-brand">Greenhouse Controller</Link>
        <Link to='/dashboard' className="nav-link">Dashboard</Link>
        <ul className=" list-inline ">
          <li className=" list-inline-item">
            {this.props.name && this.props.isAuth && <Link to='/profile' className='navbar-text'>{this.props.name}</Link>}
          </li>
          <li className=" list-inline-item">
            {!this.props.isAuth && <Link className='btn btn-outline-success my-2 my-ms-0' to='/signin'>Sign in</Link>}
          </li>
          <li className="list-inline-item">
            {!this.props.isAuth && <Link className='btn btn-outline-success my-2 my-ms-0' to='/signup'>Sign up</Link>}
          </li>
          <li className="list-inline-item">
            {this.props.isAuth && <Link className='btn btn-outline-success my-2 my-ms-0' to='/' onClick={this.props.handleSignOut}>Sign out</Link>}
          </li>
        </ul>
      </nav>
    );
  }
}
