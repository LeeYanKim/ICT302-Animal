import React, { useContext, useState, Suspense } from 'react';
import {Box, Button, Checkbox, FormControlLabel, Divider, FormLabel, FormControl, TextField, Typography, Stack, Card as MuiCard, ThemeProvider, createTheme, styled, PaletteMode} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';

import ForgotPassword from '../Components/SignIn/ForgotPassword';
import getSignInTheme from '../Components/SignIn/theme/getSignInTheme';
import CircularProgressWithLabel from '../Components/User/CircularProgressWithLabel';

import { GoogleIcon } from '../Components/SignUp/CustomIcons';

import { ProjectLogoMin } from '../Components/UI/ProjectLogo';
import UserProfile from '../Internals/UserProfile';
import { FrontendContext} from "../Internals/ContextStore";

import { getAnalytics } from "firebase/analytics";

import { signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import API from '../Internals/API';
import { storeUserInBackend, updateFrontendContext, validateInput, sanitizeInput } from '../Components/User/userUtils';

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
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false); 
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
    const email = data.get('email') as string;
    const password = data.get('password') as string;
  
    // Define whitelist characters (e.g., alphanumeric and basic symbols)
    const emailWhitelist = 'a-zA-Z0-9@._-';
    const passwordWhitelist = 'a-zA-Z0-9!@#$%^&*()_+-=';
  
    // Validate email and password
    if (!validateInput(email, emailWhitelist)) {
      setEmailError(true);
      setEmailErrorMessage('Invalid characters in email.');
      return;
    }
  
    if (!validateInput(password, passwordWhitelist)) {
      setPasswordError(true);
      setPasswordErrorMessage('Invalid characters in password.');
      return;
    }

    setLoading(true);
    setProgress(10); // Start progress
  
    // Continue with authentication logic
    try {
      const userCredential = await signInWithEmailAndPassword(frontendContext.firebaseAuth.current, email, password);
      const user = userCredential.user;

      setProgress(50);
  
      const idToken = await user.getIdToken();
  
      await storeUserInBackend(frontendContext, user, idToken).then(
          async () => {
            setProgress(75);
            await updateFrontendContext(frontendContext, user).then(() => {
              setProgress(100);
            })
          })



      
      nav('/dashboard/upload');
      
    } catch (error) {
      console.error("Error signing in with email and password:", error);
    }
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

  const handleGoogleSignIn = async () => {
    const googleProvider = new GoogleAuthProvider();
    setLoading(true);
    setProgress(10);

    try {
      // Sign in with Google
      const result = await signInWithPopup(frontendContext.firebaseAuth.current, googleProvider);
      setProgress(40);
      const user = result.user; // This is the authenticated user
  
      //console.log('Google sign-in successful:', user);
  
      // Retrieve the ID token
      const idToken = await user.getIdToken();
      setProgress(60);
      // Store the user in the backend
      await storeUserInBackend(frontendContext, user, idToken);
      setProgress(80);

      updateFrontendContext(frontendContext, user);
      setProgress(100);

      // Navigate to the dashboard
      nav('/dashboard/upload');
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false); //Hides loading symbol
    }
  };

  //console.log(process.env);
  const analytics = getAnalytics(frontendContext.firebaseRef.current);
  //console.log(analytics);

  return (
        <SignInContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <ProjectLogoMin />
            <Typography component="h1" variant="h4">
              {isSignUp ? 'Sign up' : 'Sign in'}
            </Typography>
            {loading && (
                <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgressWithLabel value={progress} />
                </Box>
            )}

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
                  <TextField id="email" type="email" name="email" placeholder="your@email.com" required fullWidth error={emailError} helperText={emailError ? emailErrorMessage : ''} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField id="password" type="password" name="password" placeholder="••••••" required fullWidth error={passwordError} helperText={passwordError ? passwordErrorMessage : ''} />
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