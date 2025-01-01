import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Grid, Paper, Box, ThemeProvider, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import GoogleIcon from '@mui/icons-material/Google';
import { auth, googleProvider } from '../config/firebase';
import '../styles/Login.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError('Invalid credentials. Please try again or sign up if you do not have an account.');
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className="login-container">
        <Paper elevation={3} className="login-paper">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 3,
            }}
          >
            <Typography component="h1" variant="h5" className="login-title">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              {['email', 'password'].map((field) => (
                <TextField
                  key={field}
                  margin="normal"
                  required
                  fullWidth
                  id={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  type={field === 'password' ? 'password' : 'text'}
                  autoComplete={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              ))}
              {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleGoogleLogin}
                className="google-button"
                startIcon={<GoogleIcon />}
              >
                Sign in with Google
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Button color="secondary" onClick={() => navigate('/signup')}>
                    Don't have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
