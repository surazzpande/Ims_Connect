import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, useTheme } from '@mui/material';
import { Home, Create, ThumbUp, Group, Timeline, Dashboard, Assessment, Star, Settings, ExitToApp } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    position: 'fixed',
    height: 'calc(100vh - 72px)',
    paddingBottom: '20px', // Add padding to the bottom
  }
});

const MenuItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  transition: 'all 0.3s ease',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    color: theme.palette.primary.main,
    transform: 'translateX(5px)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    }
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    minWidth: 40
  },
  '& .MuiListItemText-root': {
    margin: theme.spacing(0, 1)
  }
}));

const Sidebar = ({ onLogout }) => {
  const theme = useTheme();
  const location = useLocation();

  const menuItems = [
    { icon: <Home />, text: 'Home', path: '/' },
    { icon: <Create />, text: 'Idea Submission', path: '/submit-idea' },
    { icon: <ThumbUp />, text: 'Voting System', path: '/vote' },
    { icon: <Group />, text: 'Collaboration Hub', path: '/collaborate' },
    // { icon: <Timeline />, text: 'Progress Tracker', path: '/progress' },
    { icon: <Dashboard />, text: 'Regional Dashboard', path: '/regional-dashboard' },
    // { icon: <Assessment />, text: 'Evaluation Panel', path: '/evaluation' },
    { icon: <Star />, text: 'Reward Center', path: '/rewards' },
    { icon: <Settings />, text: 'Admin Dashboard', path: '/admin' }
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              component={Link}
              to={item.path}
              active={location.pathname === item.path ? 1 : 0}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <MenuItem
          onClick={onLogout}
          sx={{
            color: theme.palette.error.main,
            marginBottom: '20px', // Add margin to the bottom
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              color: theme.palette.error.main,
              '& .MuiListItemIcon-root': {
                color: theme.palette.error.main,
              }
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
