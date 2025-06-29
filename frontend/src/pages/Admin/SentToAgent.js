import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Grid
} from '@mui/material';
import creditService from '../../services/credit.service';
import userService from '../../services/user.service';

const SentToAgent = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [creditAmount, setCreditAmount] = useState('');
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('');
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    loadReportData();
  }, [page, rowsPerPage, fromDate, toDate, selectedAgents]);

  const loadAgents = () => {
    userService.getUsers({ roles: ['super agent'] }).then((response) => {
      setAgents(response.data.users);
    });
  };

  const loadReportData = () => {
    const params = {
      page,
      limit: rowsPerPage,
      fromDate,
      toDate,
      agents: selectedAgents.join(','),
    };
    creditService.getAgentCreditReport(params).then((response) => {
      setReportData(response.data.rows);
      setCount(response.data.count);
    });
  };

  const handleAgentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAgents(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleTransfer = () => {
    creditService.sendCreditToAgent({ amount: creditAmount, receiverPhone: receiverPhoneNumber }).then(() => {
      loadReportData();
      setCreditAmount('');
      setReceiverPhoneNumber('');
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Paper sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">Credit Transfer</Typography>
        <TextField
          label="Credit Amount"
          value={creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Receiver Phone Number"
          value={receiverPhoneNumber}
          onChange={(e) => setReceiverPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleTransfer}>Transfer</Button>
      </Paper>

      <Paper sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">Agent Credit Report</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Agents</InputLabel>
              <Select
                multiple
                value={selectedAgents}
                onChange={handleAgentChange}
                renderValue={(selected) => selected.join(', ')}
              >
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    <Checkbox checked={selectedAgents.indexOf(agent.id) > -1} />
                    <ListItemText primary={agent.username} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>BALANCE</TableCell>
                <TableCell>Receiver</TableCell>
                <TableCell>Sent Credit</TableCell>
                <TableCell>Received Cash</TableCell>
                <TableCell>Before Deposit</TableCell>
                <TableCell>After Deposit</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.balance}</TableCell>
                  <TableCell>{row.receiver}</TableCell>
                  <TableCell>{row.sentCredit}</TableCell>
                  <TableCell>{row.receivedCash}</TableCell>
                  <TableCell>{row.beforeDeposit}</TableCell>
                  <TableCell>{row.afterDeposit}</TableCell>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button>Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default SentToAgent;
