import React from 'react';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

const CashierLogin = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
        <Typography variant="h5">Piassa Bingo</Typography>
        <Typography variant="h4">Happy Bingo</Typography>
        <div style={{ marginTop: 20, padding: 20, border: '1px solid #ccc', borderRadius: 10 }}>
          <Typography variant="h6">PLEASE LOGIN</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoComplete="username"
            autoFocus
            InputProps={{
              startAdornment: <PersonIcon />,
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            autoComplete="current-password"
            InputProps={{
              startAdornment: <LockIcon />,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            LOGIN
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default CashierLogin;
