import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import '../styles/Header.css';
import logo from '../assets/greenfuture.png';

const Header = () => {
  return (
    <AppBar position="fixed" className="app-header">
      <Toolbar style={{ 
        backgroundColor: '#1976d2',
        padding: '8px 16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: '72px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          height: '100%'
        }}>
          <img 
            src={logo} 
            alt="Green Future Logo" 
            style={{
              height: '56px',
              width: 'auto',
              objectFit: 'contain',
              marginLeft: '10px',
              filter: 'brightness(0) invert(1)'
            }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
