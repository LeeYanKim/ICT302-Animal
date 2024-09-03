import React, {useContext, useEffect } from 'react';

import { UserProfileContext } from "../Internals/ContextStore";
import { useNavigate } from 'react-router-dom';

import UserProfile from '../Internals/UserProfile';

const SignOut: React.FC = () => {
  const userContext = useContext(UserProfileContext);

  const nav = useNavigate();

  // TODO: Add some sort of logic to tell the server to sign out the user

  useEffect(() => {
    userContext.contextRef.current = new UserProfile();
    userContext.valid = false;
    nav('/');
  }, [userContext, nav]);

  return (
    <>
    </>
  );
}

export default SignOut;