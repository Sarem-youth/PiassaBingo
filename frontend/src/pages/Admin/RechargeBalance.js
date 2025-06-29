import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button
} from '@mui/material';
import creditService from '../../services/credit.service';

const RechargeBalance = () => {
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(''); // Assuming admin will input the user ID to recharge

  const handleRecharge = () => {
    creditService.rechargeBalance({ amount, userId }).then(() => {
      // Handle success
      setAmount('');
      setUserId('');
    });
  };

  return (
    <Container>
      <Paper sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">Recharge Balance</Typography>
        <TextField
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleRecharge}>Recharge</Button>
      </Paper>
    </Container>
  );
};

export default RechargeBalance;
