import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./AppliedRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

import Home from "../../containers/Home";
import About from "../../containers/About";
import NotFound from "../../containers/NotFound";
import IndoorPosition from "../../containers/IndoorPosition";
import TagManagment from "../../containers/TagManagment";
import Contact from "../../containers/Contact";
import Login from "../../containers/LoginDialog";

export default ({ childProps ,nowpath}) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} ltype={1}/>
    <UnauthenticatedRoute path="/home" exact component={Home} props={childProps} public={true}/>
    <AuthenticatedRoute path="/tagManagment" exact component={TagManagment} props={childProps}  ltype={1} localpath={nowpath}/>
    <UnauthenticatedRoute path="/about" exact component={About} props={childProps} public={true} />
    <UnauthenticatedRoute path="/contact" exact component={Contact} props={childProps} public={true} />
    <AuthenticatedRoute path="/monitor" exact component={IndoorPosition} props={childProps} ltype={1} localpath={nowpath}/>
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
 </Switch>;
