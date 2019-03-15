import React, {Component} from 'react';


// sign in form
export default class SignIn extends Component {
  render() {
    return(
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="emailInput">Email address</label>
            <input type="email" className="form-control"  id='signInEmail' name='email' aria-describedby="emailHelp" placeholder="Enter email" />
            {
            // for validation
            // <small id="emailHelp" className="form-text text-muted">Invalid email/Email is not existant</small>
            }
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password</label>
            <input type="password" className="form-control" id='signInPassword' name='password' placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.props.handleSignIn}>Sign in</button>
        </form>
      </div>
    );
  }
}
