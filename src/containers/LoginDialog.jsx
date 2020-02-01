import React, { PureComponent } from 'react';

import * as d3 from 'd3';
import {
  DialogContainer,
  TextField,
  CircularProgress
} from 'react-md';

import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";

import { getIdentityNum } from "../libs/awsLib";
import config from "../config/user_config"; //userconfig


export default class LoginDialog extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      focusOnMount: true,
      containFocus: true,
      initialFocus: undefined,
      isLoading: false,
      email: "",
      password: "",
      disable:false
    };
  }

  componentDidMount(){
    var i = 0;
    var svg = d3.select(this.background);
    const showdialog = this.show;

    setTimeout(() => {
      showdialog();
      repeat();
    }, 100);

    function repeat() {
        svg.insert("circle")
          .attr("cx", window.innerWidth/2)
          .attr("cy", window.innerHeight/2)
          .attr("r", 1e-6)
          .attr("fill",d3.hsl((i = (i + 51) % 360), 0.2, .15))
          .style("stroke", d3.hsl(i % 360, 1, .5))
          .style("stroke-width",70)
          .style("stroke-opacity", 10)
        .transition()
          .duration(3000)
          .attr("r", window.innerWidth+window.innerHeight/2)
          .style("stroke-opacity", 1e-6)
          .style("stroke-width",2)
          .on("end", repeat)
          .remove();
        d3.select("rect")
          .transition()
          .delay(3000)
          .duration(0)
          .attr("fill",d3.hsl(i % 360, 0.2, .15))
    }
  }

  componentWillUnMount(){
    clearTimeout(this.componentDidMount);
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
        this.props.userHasAuthenticated(true,getIdentityNum());
      } catch (e) {
        alert(e);
        this.setState({ isLoading: false });
      }
    }

  show = () => {
    this.setState({ visible: true });
  };

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
    this.props.history.push("/signup");
  }

  render() {
    console.log(this.props.identity+"  "+this.props.isAuthenticated);
    const { visible, initialFocus, focusOnMount, containFocus } = this.state;
    //let user_action;
    const user_action = [{
        id: 'dialog-signin',
        children: 'Sign in',
        onClick: this.handleSubmit,
        disabled: this.validateForm()
      }];

    return (
      <div>
        <div className="video-background">
          <svg ref={background => this.background = background} width={"100%"} height={"100%"}>
            <rect width={"100%"} height={"100%"}/>
          </svg> 
        </div>
          <DialogContainer
            id="login-dialog"
            title={!this.props.isAuthenticating?"Login~":"Loading..."}
            visible={visible}
            modal
            stackedActions
            actions= {!this.props.isAuthenticating?user_action:{}}
            onHide={this.hide}
            initialFocus={initialFocus}
            focusOnMount={focusOnMount}
            containFocus={containFocus}
            contentClassName="md-grid"
          >
          {this.props.isAuthenticating?<CircularProgress id="loginload"/>:
            <div style={{width:"100%"}}>
              <TextField id="email" label="Email:" type="text" placeholder="email" className="md-cell md-cell--12" value={this.state.email}
                onChange={this.handleChange}/>
              <TextField id="password" label="Password:" placeholder="pass" className="md-cell md-cell--12" value={this.state.password}
                onChange={this.handleChange}/>
            </div>
          }
          </DialogContainer>
      </div>
    );
  }
}