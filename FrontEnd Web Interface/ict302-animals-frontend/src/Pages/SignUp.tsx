import React, { useState, useContext } from 'react';
import { Box, Button, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Import the reCAPTCHA component
import { FrontendContext } from "../Internals/ContextStore"; // Import frontend context

interface SignUpProps {
  onSignUpSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      await createUserWithEmailAndPassword(frontendContext.firebaseAuth.current, email, password);
      // On successful sign up
      if (onSignUpSuccess) onSignUpSuccess();
      nav('/dashboard'); // Navigate to the dashboard or desired page
    } catch (error) {
      setError('Error creating account: ' + error.message);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token); // Store reCAPTCHA token on change
  };

  return (
    <Box component="form" onSubmit={handleSignUpSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
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
