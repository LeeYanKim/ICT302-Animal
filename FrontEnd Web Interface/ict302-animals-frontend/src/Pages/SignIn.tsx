import React, { useContext, useState, Suspense } from 'react';
import {Box, Button, Checkbox, FormControlLabel, Divider, FormLabel, FormControl, TextField, Typography, Stack, Card as MuiCard, ThemeProvider, createTheme, styled, PaletteMode} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';

import ForgotPassword from '../Components/SignIn/ForgotPassword';
import getSignInTheme from '../Components/SignIn/theme/getSignInTheme';

import { GoogleIcon, FacebookIcon } from '../Components/SignUp/CustomIcons';

import { ProjectLogoMin } from '../Components/UI/ProjectLogo';
import UserProfile from '../Internals/UserProfile';
import { FrontendContext } from "../Internals/ContextStore";

import { getAnalytics } from "firebase/analytics";

import { signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import API from '../Internals/API';

// Dynamically import the SignUp component
const SignUp = React.lazy(() => import('../Pages/SignUp'));

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  padding: 20,
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

const SignIn: React.FC = () => {
  const frontendContext = useContext(FrontendContext);
  const nav = useNavigate();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // State to toggle between sign-in and sign-up
  const [isSignUp, setIsSignUp] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    // TODO: Fetch the user from the database and validate the password
    frontendContext.user.valid = true;
    CreatefrontendContext();

    //Example of how to sign in with Firebase Auth
    // Note this would replace the user state handeling within the frontendContext
    await signInWithEmailAndPassword(frontendContext.firebaseAuth.current, data.get('email') as string, data.get('password') as string)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);

      updateContextAndNavigate(user);
      //..
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });

  };

  const CreatefrontendContext = () => {
    // TODO: Add authentication logic here, This just uses a dummy user object for now to show logging in and user state change
    frontendContext.user.contextRef.current.username = 'No Username';
    frontendContext.user.contextRef.current.email = 'Null Email';
    frontendContext.user.contextRef.current.initials = 'Null';
    frontendContext.user.contextRef.current.loggedInState = true;
  }

  // Helper function to update frontend context
  const updateContextAndNavigate = (user: { displayName?: string | null, email?: string | null }) => {
    frontendContext.user.valid = true;
    frontendContext.user.contextRef.current.username = user.displayName || '';
    frontendContext.user.contextRef.current.email = user.email || '';
    frontendContext.user.contextRef.current.initials = user.displayName
      ? user.displayName.split(' ').map(name => name[0]).join('')
      : '';
    frontendContext.user.contextRef.current.loggedInState = true;
  
    nav('/dashboard');
  };
  

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const storeUserInBackend = async (user: { uid: string; displayName: string | null; email: string | null }, idToken: string) => {
    try {
        const payload = {
            userName: user.displayName || "Anonymous", // Only allow the frontend to set this
            userEmail: user.email, // Set the user's email
            permissionLevel: "user", // Permission level (can be adjusted later)
            // No need to send userID, userPassword, userDateJoin, or subscription fields
        };

        const response = await fetch(API.User(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`, // Send Firebase token
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to store user in the backend");
        }

        console.log("User stored/updated successfully in backend");
    } catch (error) {
        console.error("Error storing user in backend:", error);
    }
};


  const handleGoogleSignIn = async () => {
    const googleProvider = new GoogleAuthProvider();
  
    try {
      // Sign in with Google
      const result = await signInWithPopup(frontendContext.firebaseAuth.current, googleProvider);
      const user = result.user; // This is the authenticated user
  
      console.log('Google sign-in successful:', user);
  
      // Retrieve the ID token
      const idToken = await user.getIdToken();
  
      // Store the user in the backend
      await storeUserInBackend(user, idToken);
  
      // Update the frontend context with the logged-in user details
      updateContextAndNavigate(user);
  
      // Navigate to the dashboard
      nav('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  
  
  
  const handleFacebookSignIn = async () => {
    const facebookProvider = new FacebookAuthProvider();
  
    try {
      const result = await signInWithPopup(frontendContext.firebaseAuth.current, facebookProvider);
  
      // This gives you a Facebook Access Token. You can use it to access Facebook APIs.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
  
      // The signed-in user info.
      const user = result.user;
      console.log('User signed in with Facebook:', user);
  
      // Update the frontendContext with the logged-in user details
      updateContextAndNavigate(user);

      // Navigate to the dashboard after successful sign-in
      nav('/dashboard');
  
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.error("Error signing in with Facebook:", errorCode, errorMessage, email, credential);
    }
  };

  console.log(process.env);
  const analytics = getAnalytics(frontendContext.firebaseRef.current);
  console.log(analytics);

  return (
        <SignInContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <ProjectLogoMin />
            <Typography component="h1" variant="h4">
              {isSignUp ? 'Sign up' : 'Sign in'}
            </Typography>

            {isSignUp ? (
              // Render SignUp Form (loaded lazily)
              <Suspense fallback={<div>Loading...</div>}>
                <SignUp />
              </Suspense>
            ) : (
              // Render SignIn Form
              <Box component="form" onSubmit={HandleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField id="email" type="email" name="email" placeholder="your@email.com" required fullWidth />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField id="password" type="password" name="password" placeholder="••••••" required fullWidth />
                </FormControl>
                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                <Button type="submit" fullWidth variant="contained">Sign in</Button>
              </Box>
            )}            

              <Divider sx={{ my: 2 }}>
                  <Typography sx={{ color: 'text.secondary' }}>or</Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleSignIn}
                  startIcon={<GoogleIcon />}
                >
                  Sign In with Google
                </Button>
                {/* <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={handleFacebookSignIn}
                  startIcon={<FacebookIcon />}
                >
                  Sign In with Facebook
                </Button> */}
              </Box>

              <Typography sx={{ textAlign: 'center', mt: 2 }}>
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <Button onClick={() => setIsSignUp(false)} sx={{ color: 'black' }}>
                      Sign in
                    </Button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{' '}
                    <Button onClick={() => setIsSignUp(true)} sx={{ color: 'black' }}>
                      Sign-up
                    </Button>
                  </>
                )}
              </Typography>

          </Card>
        </SignInContainer>
  );
}

export default SignIn;