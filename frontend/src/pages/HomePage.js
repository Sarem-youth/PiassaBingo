import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const HomePage = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Piassa Bingo
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" component={Link} to="/admin/login" sx={{ m: 1 }}>
          Admin Login
        </Button>
        <Button variant="contained" component={Link} to="/cashier/login" sx={{ m: 1 }}>
          Cashier Login
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
