import React, { useState, useContext } from 'react';
import { Box, Button, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Import the reCAPTCHA component
import { FrontendContext } from "../Internals/ContextStore"; // Import frontend context
import API from '../Internals/API';

interface SignUpProps {
  onSignUpSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(''); // New username state
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const frontendContext = useContext(FrontendContext); // Get the frontend context
  const nav = useNavigate();

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA');
      return;
    }

    try {
      // Create user with Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(frontendContext.firebaseAuth.current, email, password);
      const user = userCredential.user; // Firebase authenticated user

      // Retrieve the ID token
      const idToken = await user.getIdToken();

      // Store the user in the backend
      await storeUserInBackend(user, idToken);
      
      // On successful sign up
      if (onSignUpSuccess) onSignUpSuccess();

      updateContextAndNavigate(user);

      nav('/dashboard'); // Navigate to the dashboard or desired page
    } catch (error) {
      setError('Error creating account: ' + (error as Error).message);
    }
  };

  const storeUserInBackend = async (user: { uid: string; displayName: string | null; email: string | null }, idToken: string) => {
    try {
      const payload = {
        userName: username, // Set the username from the form input
        userEmail: user.email, // Set the user's email
        permissionLevel: "user", // You can set the permission level accordingly
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

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token); // Store reCAPTCHA token on change
  };

  return (
    <Box component="form" onSubmit={handleSignUpSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
      <FormControl>
        <FormLabel htmlFor="username">Username</FormLabel> {/* Username label */}
        <TextField
          id="username"
          type="text"
          name="username"
          placeholder="Your Username"
          required
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="password">Create Password</FormLabel>
        <TextField
          id="password"
          type="password"
          name="password"
          placeholder="••••••"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="confirmPassword">Re-enter Password</FormLabel>
        <TextField
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="••••••"
          required
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>

      {error && <Typography color="error">{error}</Typography>}

      <FormControl>
        <ReCAPTCHA
          sitekey="6LdD8VgqAAAAAFZ2fzniAJ9rmDc_es3C0fp9P9Ma"
          onChange={handleRecaptchaChange}
        />
      </FormControl>

      <Button type="submit" fullWidth variant="contained">
        Sign up
      </Button>
    </Box>
  );
};

export default SignUp;

