import React, {Component} from 'react';


// sign in form
export default class SignUp extends Component {
  render() {
    return(
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="emailInput">Email address</label>
            <input type="email" className="form-control"  id='signUpEmail' name='email' aria-describedby="emailHelp" placeholder="Enter email" />
            {
            // for validation
            // <small id="emailHelp" className="form-text text-muted">Email already taken</small>
            }
          </div>
          <div className="form-group">
            <label htmlFor="nameInput">Name</label>
            <input type="text" className="form-control"  id='signUpName' name='signUpName' aria-describedby="nameHelp" placeholder="Enter name" />
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password</label>
            <input type="password" className="form-control" id='signUpPassword' name='password' placeholder="Password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPasswordInput">Confirm Password</label>
            <input type="password" className="form-control" id='signUpConfirmPassword' name='confirmPassword' placeholder="Confirm Password" />
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.props.handleSignUp}>Sign in</button>
        </form>
      </div>
    );
  }
}
