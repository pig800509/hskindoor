import React, { Component } from 'react';
//import { Link } from "react-router-dom";
import {
  DialogContainer,
  TextField
} from 'react-md';

import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";

import Home from "./Home"
import userconfig from "../config/user_config";
import adminconfig from "../config/admin_config"

var config = userconfig ;

export default class LoginDialog extends Component {
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
      disable:false
    };
    //console.log (this.props.ltype);
    if(this.props.ltype===2) {
      config = adminconfig;
    }
    else{
      config = userconfig;
    }
  }

    login(email, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
    }

    handleSubmit = async event => {
      event.preventDefault();

      this.setState({ isLoading: true });

      try {
        await this.login(this.state.email, this.state.password);
        this.props.userHasAuthenticated(true,this.props.ltype);

      } catch (e) {
        alert(e);
        this.setState({ isLoading: false });
      }
    }

  
  hide = () => {
    this.setState({ visible: false });
  };
  

  handleTargetChange = (value) => {
    this.setState({ initialFocus: value ? `#${value}` : undefined });
  };

  handleMountChange = (checked) => {
    this.setState({ focusOnMount: checked });
  };

  handleFocusChange = (checked) => {
    this.setState({ containFocus: checked });
  };

  validateForm() {
    return !(this.state.email.length > 0 && this.state.password.length > 0);
  }

  handleChange = (v,e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  toSignup =() => {
    this.props.history.push("/usersignup");
  }

  render() {
    const { visible, initialFocus, focusOnMount, containFocus } = this.state;
    let user_action;
    if(this.props.ltype===1) {
    user_action = [{
        id: 'dialog-signup',
        primary: true,
        children: 'Sign Up',
        onClick: this.toSignup
      },{
        id: 'dialog-signin',
        primary: true,
        children: 'Sign in',
        onClick: this.handleSubmit,
        disabled: this.validateForm()
      }];
    }
    else {
      user_action = [{
        id: 'dialog-signin',
        primary: true,
        children: 'Sign in',
        onClick: this.handleSubmit,
        disabled: this.validateForm()
      }];
    }
    return (
      <div>
        <Home />
        <DialogContainer
          id="login-dialog"
          title="Login~"
          visible={visible}
          modal
          actions= {user_action}
          onHide={this.hide}
          initialFocus={initialFocus}
          focusOnMount={focusOnMount}
          containFocus={containFocus}
          contentClassName="md-grid"
        >
          <TextField id="email" label="Email:" type="email" placeholder="email" className="md-cell md-cell--12" value={this.state.email}
              onChange={this.handleChange}/>
          <TextField id="password" label="Password:" placeholder="pass" className="md-cell md-cell--12" value={this.state.password}
              onChange={this.handleChange}/>
        </DialogContainer>
      </div>
    );
  }
}