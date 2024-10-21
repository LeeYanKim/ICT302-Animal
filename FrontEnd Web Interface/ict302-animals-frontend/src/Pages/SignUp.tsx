import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { FrontendContext } from "../Internals/ContextStore";
import { storeUserInBackend, updateFrontendContext, validateInput, sanitizeInput, checkPasswordStrength, passwordFeedback } from '../Components/User/userUtils';

interface SignUpProps {
  onSignUpSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(''); // Password strength state
  const [passwordFeedbackMessages, setPasswordFeedbackMessages] = useState<string[]>([]); // Password feedback state
  const frontendContext = useContext(FrontendContext);
  const nav = useNavigate();

  useEffect(() => {
    const strength = checkPasswordStrength(password);
    setPasswordStrength(strength);

    const feedback = passwordFeedback(password);
    setPasswordFeedbackMessages(feedback);
  }, [password]);

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const usernameWhitelist = 'a-zA-Z0-9';
    const emailWhitelist = 'a-zA-Z0-9@._-';
    const passwordWhitelist = 'a-zA-Z0-9!@#$%^&*()_+-=';

    const isUsernameValid = validateInput(username, usernameWhitelist);
    const isEmailValid = validateInput(email, emailWhitelist);
    const isPasswordValid = validateInput(password, passwordWhitelist);

    if (!isUsernameValid) {
      setError('Username contains invalid characters. Please use only letters and numbers.');
      return;
    }

    if (!isEmailValid) {
      setError('Email contains invalid characters.');
      return;
    }

    if (!isPasswordValid) {
      setError('Password contains invalid characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA');
      return;
    }

    const sanitizedUsername = sanitizeInput(username, usernameWhitelist);
    const sanitizedEmail = sanitizeInput(email, emailWhitelist);
    const sanitizedPassword = sanitizeInput(password, passwordWhitelist);

    try {
      const userCredential = await createUserWithEmailAndPassword(frontendContext.firebaseAuth.current, sanitizedEmail, sanitizedPassword);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: sanitizedUsername,
      });

      const idToken = await user.getIdToken();

      await storeUserInBackend(frontendContext, user, idToken);

      if (onSignUpSuccess) onSignUpSuccess();

      await updateFrontendContext(frontendContext, user);

      nav('/dashboard');
    } catch (error) {
      setError('Error creating account: ' + (error as Error).message);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  return (
    <Box component="form" onSubmit={handleSignUpSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
      <FormControl>
        <FormLabel htmlFor="username">Username</FormLabel>
        <TextField
          id="username"
          type="text"
          name="username"
          placeholder="Your Username"
          required
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        {passwordStrength && (
          <Typography color={passwordStrength === 'Weak' ? 'error' : passwordStrength === 'Medium' ? 'warning' : 'success'}>
            Password Strength: {passwordStrength}
          </Typography>
        )}
        {passwordFeedbackMessages.length > 0 && (
          <ul>
            {passwordFeedbackMessages.map((message, index) => (
              <li key={index} style={{ color: 'red' }}>{message}</li>
            ))}
          </ul>
        )}
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
