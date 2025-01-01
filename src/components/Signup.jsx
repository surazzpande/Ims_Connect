import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, Avatar, Grid, ThemeProvider, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import '../styles/Signup.css';

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

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
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

    const { name, surname, email, password, confirmPassword, phone } = formData;

    if (!name || !surname || !email || !password || !confirmPassword || !phone) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${name} ${surname}`,
        phoneNumber: phone
      });
      console.log('User registered successfully');
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" className="signup-container">
        <Paper elevation={3} className="signup-paper">
          <Avatar className="signup-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="signup-title">
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} className="signup-form">
            <Grid container spacing={2}>
              {['name', 'surname', 'email', 'phone', 'password', 'confirmPassword'].map((field) => (
                <Grid item xs={12} sm={field === 'name' || field === 'surname' ? 6 : 12} key={field}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    name={field}
                    type={field.includes('password') ? 'password' : 'text'}
                    autoComplete={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </Grid>
              ))}
            </Grid>
            {error && <Typography color="error" variant="body2" className="error-message">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="submit-button"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </form>
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={() => navigate('/login')}
            className="login-link"
          >
            Already have an account? Sign in
          </Button>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default Signup;
