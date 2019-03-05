import React, { useContext, useEffect, useMemo } from "react";
import { __RouterContext } from "react-router-dom";

import {
  authenticateUser,
  getUserManager,
  oidcLog,
  isRequireAuthentication
} from "../Services";
import { Authenticating } from "../OidcComponents";
import { AuthenticationContext } from "./AuthenticationContextCreator";

export const useOidcSecure = () => {
  const { location } = useContext(__RouterContext);
  const { isEnabled, oidcUser } = useContext(AuthenticationContext);
  if (isEnabled) {
    useEffect(() => {
      oidcLog.info("Hook used !");
      oidcLog.info("Protected component mounted");
      const usermanager = getUserManager();
      authenticateUser(usermanager, location)();
    }, [location, isEnabled, oidcUser]);
  }
  return oidcUser;
};

export const withOidcSecure = WrappedComponent => props => {
  const oidcUser = useOidcSecure();
  const requiredAuth = useMemo(() => isRequireAuthentication(oidcUser, false), [
    oidcUser
  ]);
  if (requiredAuth) {
    return <Authenticating />;
  }
  return <WrappedComponent {...props} />;
};

const OidcSecure = props => {
  useOidcSecure();
  const { children } = props;
  return children;
};

export default OidcSecure;
