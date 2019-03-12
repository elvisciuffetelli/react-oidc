import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import { getUserManager, oidcLog, withServices } from '../Services';
import CallbackComponent from './Callback.component';

export const onRedirectSuccess = (history, oidcLog) => user => {
  oidcLog.info('Successfull login Callback');
  if (user.state.url) {
    history.push(user.state.url);
  } else {
    oidcLog.warn("no location in state");
  }
};

export const onRedirectError = (history, oidcLog) => ({ message }) => {
  oidcLog.error(`There was an error handling the token callback: ${message}`);
  history.push(
    `/authentication/not-authenticated?message=${encodeURIComponent(message)}`
  );
};

export const CallbackContainer = ({ history, getUserManager, oidcLog }) => {
  const onSuccess = useCallback(onRedirectSuccess(history, oidcLog), [history]);
  const onError = useCallback(onRedirectError(history, oidcLog), [history]);

  useEffect(() => {
    getUserManager()
      .signinRedirectCallback()
      .then(onSuccess, onError);
  }, []);
  return <CallbackComponent />;
};

export default withRouter(
  withServices(CallbackContainer, { getUserManager, oidcLog })
);
