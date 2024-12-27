// src/components/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <Box className="footer-container" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <Typography variant="body2">&copy; 2024 GreenFuture. All rights reserved.</Typography>
    </Box>
  );
}

export default Footer;
