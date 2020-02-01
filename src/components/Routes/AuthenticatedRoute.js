import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      cProps.identity>=rest.ltype
        ? <C {...props} {...cProps} ltype={rest.ltype}/>
        : <Redirect
            to={`/login?redirect=${props.location.pathname}${props.location.search}`}
          />}
  />;
