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
  ListItemText
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
    loadReportData();
  }, [page, rowsPerPage, fromDate, toDate, selectedAgents]);

  const loadAgents = () => {
    userService.getUsers({ role: 'agent' }).then(response => {
      setAgents(response.data);
    });
  };

  const loadReportData = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      from: fromDate,
      to: toDate,
      agents: selectedAgents.join(',')
    };
    creditService.getAgentCreditReport(params).then(response => {
      setReportData(response.data.items);
      setCount(response.data.totalItems);
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
    // Assuming senderId is available from auth context
    const senderId = 1; // Replace with actual sender ID
    creditService.sendCreditToAgent({
      amount: creditAmount,
      receiverPhoneNumber,
      senderId
    }).then(() => {
      loadReportData();
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
        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Agents</InputLabel>
            <Select
              multiple
              value={selectedAgents}
              onChange={handleAgentChange}
              input={<OutlinedInput label="Agents" />}
              renderValue={(selected) => selected.map(id => agents.find(a => a.id === id)?.name).join(', ')}
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  <Checkbox checked={selectedAgents.indexOf(agent.id) > -1} />
                  <ListItemText primary={agent.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={loadReportData}>Submit</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>BALANCE</TableCell>
                <TableCell>Receiver</TableCell>
                <TableCell>Sent Credit</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.receiver.balance}</TableCell>
                  <TableCell>{row.receiver.name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{row.status}</TableCell>
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
