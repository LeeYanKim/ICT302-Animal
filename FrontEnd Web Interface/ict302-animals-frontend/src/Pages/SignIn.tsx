import React, { useContext, useRef } from 'react';
import {Box, Button, Checkbox, FormControlLabel, Divider, FormLabel, FormControl, TextField, Typography, Stack, Card as MuiCard, ThemeProvider, createTheme, styled, PaletteMode} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';

import ForgotPassword from '../Components/SignIn/ForgotPassword';
import getSignInTheme from '../Components/SignIn/theme/getSignInTheme';

import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';


import { ProjectLogoMin } from '../Components/UI/ProjectLogo';
import UserProfile from '../Internals/UserProfile';
import { UserProfileContext } from "../Internals/ContextStore";

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
  const userContext = useContext(UserProfileContext);
  const nav = useNavigate();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const HandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    // TODO: Fetch the user from the database and validate the password
    userContext.valid = true;
    CreateUserContext();

  };

  const CreateUserContext = () => {
    // TODO: Add authentication logic here, This just uses a dummy user object for now to show logging in and user state change
    userContext.contextRef.current.username = 'Bryce Standley';
    userContext.contextRef.current.email = 'bryce@vectorpixel.net';
    userContext.contextRef.current.initials = 'BS';
    userContext.contextRef.current.loggedInState = true;
    
    
    nav('/dashboard');
  }

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

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth sign-in logic
    alert('Sign in with Google');
  };
  
  const handleFacebookSignIn = () => {
    // TODO: Implement Facebook OAuth sign-in logic
    alert('Sign in with Facebook');
  };
  

  return (
        <SignInContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <ProjectLogoMin />
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={HandleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                  sx={{ ariaLabel: 'email' }}
                />
              </FormControl>
              <FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Button
                    onClick={handleClickOpen}
                    sx={{ alignSelf: 'baseline' }}
                  >
                    Forgot your password?
                  </Button>
                </Box>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <ForgotPassword open={open} handleClose={handleClose} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign in
              </Button>
              <Divider sx={{ my: 2 }}>
                  <Typography sx={{ color: 'text.secondary' }}>or</Typography>
              </Divider>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleSignIn}
                  startIcon={<GoogleIcon />}
                >
                  Sign in with Google
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleFacebookSignIn}
                  startIcon={<FacebookIcon />}
                >
                Sign in with Facebook
                </Button>
              </Box>
              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span>
                  <Button
                    component={Link}
                    sx={{ alignSelf: 'center', color: 'white'}}
                    to={'/signup'}
                    >
                        Sign-up
                    </Button>
                </span>
              </Typography>
            </Box>
          </Card>
        </SignInContainer>
  );
}

export default SignIn;