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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import gameService from '../../services/game.service';
import userService from '../../services/user.service';

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    shop: '',
    gameId: ''
  });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadGames();
    loadShops();
  }, [page, rowsPerPage]);

  useEffect(() => {
    loadGames();
  }, [filters]);

  const loadGames = () => {
    const params = {
      page,
      limit: rowsPerPage,
      ...filters
    };
    gameService.getAllGames(params).then((response) => {
      setGames(response.data.games || []);
      setCount(response.data.count || 0);
    }).catch((error) => {
      console.error('Error loading games:', error);
      setGames([]);
      setCount(0);
    });
  };

  const loadShops = () => {
    userService.getUsers({ roles: ['shop'] }).then((response) => {
      setShops(response.data.users || []);
    }).catch((error) => {
      console.error('Error loading shops:', error);
      setShops([]);
    });
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    setPage(0);
    loadGames();
  };

  const handleExport = () => {
    const params = {
      ...filters,
      export: true
    };
    gameService.getAllGames(params).then((response) => {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `game-results-${filters.dateFrom}-${filters.dateTo}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleViewDetails = (game) => {
    setSelectedGame(game);
    setDetailsOpen(true);
    setLoadingDetails(true);
    gameService.getGameById(game.id).then((res) => {
      setGameDetails(res.data);
      setLoadingDetails(false);
    }).catch(() => setLoadingDetails(false));
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedGame(null);
    setGameDetails(null);
  };

  // Game actions
  const handleStartGame = (game) => {
    gameService.startGame(game.id, game.winningPattern || 'any one line', game.stake || 10).then(loadGames);
  };
  const handleResetGame = (game) => {
    gameService.updateGame(game.id, game.settings, 'pending', []).then(loadGames);
  };

  return (
    <Container>
      <Paper sx={{ p: 2, my: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Game Results Management</Typography>
        
        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              name="dateFrom"
              label="From Date"
              type="date"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="dateTo"
              label="To Date"
              type="date"
              value={filters.dateTo}
              onChange={handleFilterChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Select Shop</InputLabel>
              <Select
                name="shop"
                value={filters.shop}
                onChange={handleFilterChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Shops</em>
                </MenuItem>
                {shops.map((shop) => (
                  <MenuItem key={shop.id} value={shop.id}>
                    {shop.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              name="gameId"
              label="Game ID"
              value={filters.gameId}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button variant="outlined" onClick={handleExport} fullWidth>
              Export
            </Button>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>

        {/* Game Results Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Game ID</TableCell>
                <TableCell>Bet</TableCell>
                <TableCell>Players</TableCell>
                <TableCell>Total Placed</TableCell>
                <TableCell>Cut</TableCell>
                <TableCell>Payout</TableCell>
                <TableCell>Shop</TableCell>
                <TableCell>Winners</TableCell>
                <TableCell>Cartela Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.id}</TableCell>
                  <TableCell>{game.stake || 'N/A'}</TableCell>
                  <TableCell>{game.player_count || 0}</TableCell>
                  <TableCell>{game.total_placed || 0}</TableCell>
                  <TableCell>{game.cut || 0}</TableCell>
                  <TableCell>{game.payout || 0}</TableCell>
                  <TableCell>{game.shop?.name || 'N/A'}</TableCell>
                  <TableCell>{game.winner_count || 0}</TableCell>
                  <TableCell>{game.cartela_type || 'Standard'}</TableCell>
                  <TableCell>
                    {game.created_at ? new Date(game.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={game.status || 'unknown'} 
                      color={getStatusColor(game.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleViewDetails(game)}>Details</Button>
                    {game.status === 'pending' && (
                      <Button size="small" variant="contained" color="success" sx={{ ml: 1 }} onClick={() => handleStartGame(game)}>Start</Button>
                    )}
                    {game.status === 'active' && (
                      <Button size="small" variant="contained" color="error" sx={{ ml: 1 }} onClick={() => handleResetGame(game)}>Reset</Button>
                    )}
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
        
        {/* Game Details Dialog */}
        <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          <DialogTitle>Game Details</DialogTitle>
          <DialogContent>
            {loadingDetails ? (
              <Typography>Loading...</Typography>
            ) : gameDetails ? (
              <Box>
                <Typography><b>Game ID:</b> {gameDetails.id}</Typography>
                <Typography><b>Status:</b> {gameDetails.status}</Typography>
                <Typography><b>Stake:</b> {gameDetails.stake}</Typography>
                <Typography><b>Winning Pattern:</b> {gameDetails.winning_pattern || gameDetails.winningPattern}</Typography>
                <Typography><b>Drawn Numbers:</b> {Array.isArray(gameDetails.drawn_numbers || gameDetails.drawnNumbers) ? (gameDetails.drawn_numbers || gameDetails.drawnNumbers).join(', ') : 'N/A'}</Typography>
                {/* Add more details as needed */}
                {/* Winners info if available */}
                {gameDetails.winners && (
                  <Box sx={{ mt: 2 }}>
                    <Typography><b>Winners:</b></Typography>
                    {gameDetails.winners.map((w, i) => (
                      <Typography key={i}>{w}</Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Typography>No details found.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default GameManagement;
