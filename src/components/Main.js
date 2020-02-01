import React, { PureComponent } from 'react';
//import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { withRouter } from 'react-router';
import { Link, Switch } from 'react-router-dom';
import { Drawer, Toolbar } from 'react-md';

import { authUser, signOutUser, getIdentityNum} from "../libs/awsLib";
import Routes from "./Routes/Routes";

import NavItemLink from './SideMenu/NavItemLink';

import Header from './Header'

const TO_PREFIX = '/';

class Main extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      isAuthenticated: false,
      isAuthenticating: true,
      identity:0
    };
  }

  async componentDidMount() {

    this.dialog = document.getElementById('drawer-routing-example-dialog');

    try {
      if (await authUser()) {
        this.userHasAuthenticated(true,getIdentityNum());
        //console.log("user login ! identity:"+getIdentityNum()+"id:"+this.state.identity);
        //console.log("username: "+getUserAttribute("username"));
        //console.log("email: "+ getUserAttribute("email"));
      }
      else {
        this.userHasAuthenticated(false,0);
      }
      
    }
    catch(e) {
      alert(e);
    }
    this.setState({isAuthenticating: false});
    console.log(this.state.isAuthenticating);
  }

  userHasAuthenticated = (authenticated,num) => {
    this.setState({isAuthenticated: authenticated ,identity: num});
  }
  
  handleLogout = event => {
    signOutUser();

    this.userHasAuthenticated(false,0);

    this.props.history.push("/");
  }

  showDrawer = () => {
    this.setState({ visible: true });
  };

  hideDrawer = () => {
    this.setState({ visible: false });
  };

  handleVisibility = (visible) => {
    this.setState({ visible });
  };

  render() {
    console.log(this.props);
    const { location } = this.props;
    console.log(location.pathname);
    const { visible, isAuthenticated} = this.state;

    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      identity: this.state.identity,
      isAuthenticating:this.state.isAuthenticating
    };
    
    const navitems = [{label: 'Home',to: TO_PREFIX,exact: true,icon: 'home'}, 
                  {label: 'IndoorMonitor',to: `/monitor`,icon: 'dashboard'},
                  {label: 'Tag Managment',to: `/tagmanagment`,icon: 'accessibility'},
                  {label: 'About',to: `/about`,icon: 'accessibility'},
                  {label: 'Contact',to: `/contact`,icon: 'accessibility'}];
    return (
      <div>
        <Header authStatus={isAuthenticated} showMenu={this.showDrawer} logout={this.handleLogout}/>

        <CSSTransitionGroup
          transitionName="md-cross-fade"
          transitionEnterTimeout={300}
          transitionLeave={false}
          className="md-toolbar-relative md-grid"
        >
          <Switch key={location.pathname}>
            <Routes childProps={childProps} nowpath={location.pathname}/>
          </Switch>

        </CSSTransitionGroup>
        <Drawer
          type={Drawer.DrawerTypes.TEMPORARY}
          visible={visible}
          onVisibilityChange={this.handleVisibility}
          header={<Toolbar title={<Link to="/">Menu</Link>} />}
          renderNode={this.dialog}
          navItems={navitems.map(props => <NavItemLink {...props} key={props.to} />)}
        />
      </div>
    );
  }
}
export default withRouter(Main);
