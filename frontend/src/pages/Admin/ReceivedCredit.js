import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  TextField,
  Button
} from '@mui/material';
import creditService from '../../services/credit.service';

const ReceivedCredit = () => {
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    loadReportData();
  }, [page, rowsPerPage, fromDate, toDate]);

  const loadReportData = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      from: fromDate,
      to: toDate
    };
    creditService.getReceivedCreditReport(params).then(response => {
      setReportData(response.data.items);
      setCount(response.data.totalItems);
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
        <Typography variant="h6">Received Credit Report</Typography>
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
          <Button variant="contained" onClick={loadReportData}>Submit</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sender</TableCell>
                <TableCell>Receiver</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.sender ? row.sender.name : 'System'}</TableCell>
                  <TableCell>{row.receiver.name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
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

export default ReceivedCredit;
