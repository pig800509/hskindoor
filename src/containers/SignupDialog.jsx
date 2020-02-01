import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  DialogContainer,
  TextField
} from 'react-md';
import {
  AuthenticationDetails,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import config from "../config/user_config";
import Home from "./Home"

export default class SignupDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      focusOnMount: true,
      containFocus: true,
      initialFocus: undefined,
      isLoading: false,
      email: "",
      password: "",
      disable:false,
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return !(
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password == this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return !this.state.confirmationCode.length > 0;
  }

  hide = () => {
    this.setState({ visible: false });
  };

  handleChange = (v,e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await this.signup(this.state.email, this.state.password);
      this.setState({
        newUser: newUser
      });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.confirm(this.state.newUser, this.state.confirmationCode);
      await this.authenticate(
        this.state.newUser,
        this.state.email,
        this.state.password
      );

      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  signup(email, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    return new Promise((resolve, reject) =>
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result.user);
      })
    );
  }

  confirm(user, confirmationCode) {
    return new Promise((resolve, reject) =>
      user.confirmRegistration(confirmationCode, true, function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
    );
  }

  authenticate(user, email, password) {
    const authenticationData = {
      Username: email,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  renderConfirmationForm() {
    const { visible, initialFocus, focusOnMount, containFocus } = this.state;
    let confirm_action = [
    {
      id: 'dialog-Confirm',
      primary: true,
      children: 'Confirm',
      onClick: this.handleConfirmationSubmit,
      disabled: this.validateConfirmationForm()
    }];

    return (
      <div>
        <DialogContainer
          id="confirm-dialog"
          title="Confirm~"
          visible={visible}
          actions= {confirm_action}
          onHide={this.hide}
          initialFocus={initialFocus}
          focusOnMount={focusOnMount}
          containFocus={containFocus}
          contentClassName="md-grid"
        >
        <TextField id="confirmationCode" label="" type="tel" className="md-cell md-cell--12" value={this.state.confirmationCode}
              onChange={this.handleChange}/>
        </DialogContainer>
      </div>
    );
  }

  renderForm() {
    
    const { visible, initialFocus, focusOnMount, containFocus } = this.state;
    let Signup_action = [{
      id: 'dialog-signin',
      primary: true,
      children: 'Sign in'
    },{
      id: 'dialog-signup',
      primary: true,
      children: 'Sign Up',
      onClick: this.handleSubmit,
      disabled: this.validateForm()
    }];

    return (
      <div>
        <DialogContainer
          id="Signup-dialog"
          title="Sign up~"
          visible={visible}
          actions= {Signup_action}
          onHide={this.hide}
          initialFocus={initialFocus}
          focusOnMount={focusOnMount}
          containFocus={containFocus}
          contentClassName="md-grid"
        >
          <TextField id="email" label="Email:" type="email" placeholder="email" className="md-cell md-cell--12" value={this.state.email}
              onChange={this.handleChange}/>
          <TextField id="password" label="Password:" type="password" placeholder="pass" className="md-cell md-cell--12" value={this.state.password}
              onChange={this.handleChange}/>
          <TextField id="confirmPassword" label="Confirm Password:" type="password" placeholder="pass" className="md-cell md-cell--12" value={this.state.confirmPassword}
              onChange={this.handleChange}/>
        </DialogContainer>
      </div>
    );
  }

  render() {
    return (
      <div className="Signup">
      <Home/>
        {this.state.newUser == null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }

}