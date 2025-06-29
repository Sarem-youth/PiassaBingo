import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/admin/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/admin/super-agents">
              <ListItemText primary="Super Agents" />
            </ListItem>
            <ListItem button component={Link} to="/admin/shops">
              <ListItemText primary="Shops" />
            </ListItem>
            <ListItem button component={Link} to="/admin/sent-to-agent">
              <ListItemText primary="Sent To Agent" />
            </ListItem>
            <ListItem button component={Link} to="/admin/sent-to-shop">
              <ListItemText primary="Sent To Shop" />
            </ListItem>
            <ListItem button component={Link} to="/admin/received-credit">
              <ListItemText primary="Received Credit" />
            </ListItem>
            <ListItem button component={Link} to="/admin/recharge-balance">
              <ListItemText primary="Recharge Balance" />
            </ListItem>
            <ListItem button component={Link} to="/admin/game-management">
              <ListItemText primary="Game Management" />
            </ListItem>
            <ListItem button component={Link} to="/admin/cartela-management">
              <ListItemText primary="Cartela Management" />
            </ListItem>
            <ListItem button component={Link} to="/admin/new-page-1">
              <ListItemText primary="New Page 1" />
            </ListItem>
            <ListItem button component={Link} to="/admin/new-page-2">
              <ListItemText primary="New Page 2" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
