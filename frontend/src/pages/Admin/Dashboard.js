import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboard.service';
import { Container, Paper, Typography, Grid, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [shops, setShops] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    agent: '',
    shop: '',
  });

  useEffect(() => {
    loadDashboardData();
    loadAgents();
    loadShops();
  }, []);

  const loadDashboardData = () => {
    dashboardService.getDashboardData(filters).then((response) => {
      setData(response.data);
    });
  };

  const loadAgents = () => {
    dashboardService.getAgents().then((response) => {
      setAgents(response.data.users);
    });
  };

  const loadShops = () => {
    dashboardService.getShops().then((response) => {
      setShops(response.data.users);
    });
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    loadDashboardData();
  };

  return (
    <Container>
      <Paper sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">Admin Dashboard</Typography>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Date</InputLabel>
              <Select
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Date</em>
                </MenuItem>
                {/* Add date options here */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Agent</InputLabel>
              <Select
                name="agent"
                value={filters.agent}
                onChange={handleFilterChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Agent</em>
                </MenuItem>
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Shop</InputLabel>
              <Select
                name="shop"
                value={filters.shop}
                onChange={handleFilterChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Shop</em>
                </MenuItem>
                {shops.map((shop) => (
                  <MenuItem key={shop.id} value={shop.id}>{shop.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
          </Grid>
        </Grid>
        {data && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Today's Sales: {data.todaySales}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography>Weekly Sales: {data.weeklySales}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography>Monthly Sales: {data.monthlySales}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography>Yearly Sales: {data.yearlySales}</Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
