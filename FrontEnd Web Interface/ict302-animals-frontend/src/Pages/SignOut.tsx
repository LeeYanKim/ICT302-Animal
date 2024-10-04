import React, {useContext, useEffect } from 'react';

import { FrontendContext } from "../Internals/ContextStore";
import { useNavigate } from 'react-router-dom';

import UserProfile from '../Internals/UserProfile';

const SignOut: React.FC = () => {
  const frontendContext = useContext(FrontendContext);

  const nav = useNavigate();

  // TODO: Add some sort of logic to tell the server to sign out the user

  useEffect(() => {
    frontendContext.user.contextRef.current = new UserProfile();
    frontendContext.user.valid = false;
    nav('/');
  }, [frontendContext.user, nav]);

  return (
    <>
    </>
  );
}

export default SignOut;