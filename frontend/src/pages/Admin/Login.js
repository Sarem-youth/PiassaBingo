import React from 'react';
import { Button, TextField, Typography, Container, Paper, Checkbox, FormControlLabel, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
        <Typography variant="h5">Sign In</Typography>
        <Typography variant="body2">Please enter your username and password</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Your username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Your password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <Button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </Button>
            ),
          }}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          Sign in
        </Button>
        <Link href="#" variant="body2" style={{ marginTop: 10 }}>
          Forgot password?
        </Link>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
