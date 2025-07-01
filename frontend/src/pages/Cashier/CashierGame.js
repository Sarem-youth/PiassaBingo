import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Divider
} from '@mui/material';
import { io } from 'socket.io-client';
import gameService from '../../services/game.service';
import cartelaService from '../../services/cartela.service';

const WINNING_PATTERNS = [
  'any one line', 'any two lines', 'any vertical', 'any horizontal', 'T', 'Reverse T', 'X', 'L', 'Reverse L',
  'half above', 'half below', 'full', 'half left', 'half right', 'G and O', 'B and O', 'Mark', 'T cross'
];
const STAKES = [10, 20, 30, 40, 50, 100, 200, 300, 400, 500];
const NUMBER_RANGE = 75; // or 100 depending on config
const CARD_COUNT = 250;

const CashierGame = () => {
  // Game state
  const [gameId, setGameId] = useState(null);
  const [gameStatus, setGameStatus] = useState('idle');
  const [winningPattern, setWinningPattern] = useState(WINNING_PATTERNS[0]);
  const [stake, setStake] = useState(STAKES[0]);
  const [registeredCards, setRegisteredCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [recentNumbers, setRecentNumbers] = useState([]);
  const [numberCalling, setNumberCalling] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(2000); // ms
  const [cardInput, setCardInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const timerRef = useRef(null);
  const socketRef = useRef(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    socketRef.current = io('http://localhost:8080'); // Adjust URL as needed

    socketRef.current.on('number_drawn', (data) => {
      if (data.gameId === gameId) {
        setDrawnNumbers((prev) => [...prev, data.number]);
        setRecentNumbers((prev) => [data.number, ...prev].slice(0, 5));
      }
    });

    socketRef.current.on('winner_verified', (data) => {
      if (data.gameId === gameId) {
        setVerifyResult(data.result);
      }
    });

    socketRef.current.on('game_reset', (data) => {
      if (data.gameId === gameId) {
        handleReset();
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [gameId]);

  // Start a new game round
  const handleStartNewGame = () => {
    setShowStartModal(true);
  };

  const confirmStartGame = async () => {
    // Create game in backend
    const res = await gameService.createGame(null, { winningPattern, stake });
    setGameId(res.data.id);
    setGameStatus('registering');
    setDrawnNumbers([]);
    setRecentNumbers([]);
    setRegisteredCards([]);
    setSelectedCards([]);
    setShowStartModal(false);
    setShowRegisterModal(true);
    setVerifyResult(null);
  };

  // Register cards for the round
  const handleCardClick = (cardNumber) => {
    if (selectedCards.includes(cardNumber)) {
      setSelectedCards(selectedCards.filter((n) => n !== cardNumber));
    } else {
      setSelectedCards([...selectedCards, cardNumber]);
    }
  };

  const handleRegisterCards = async () => {
    if (!gameId || selectedCards.length === 0) return;
    await Promise.all(selectedCards.map(cardNumber =>
      cartelaService.createCartela(cardNumber, 'registered', null)
        .then(res => gameService.registerCartela(gameId, res.data.id))
    ));
    setRegisteredCards(selectedCards);
    setGameStatus('ready');
    setShowRegisterModal(false);
  };

  // Start/stop number calling
  const handleStartCalling = () => {
    setNumberCalling(true);
    setGameStatus('calling');
    // Optionally, emit an event to notify others that calling has started
    if (socketRef.current && gameId) {
      socketRef.current.emit('start_calling', { gameId });
    }
  };
  const handleStopCalling = () => {
    setNumberCalling(false);
    setGameStatus('paused');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (socketRef.current && gameId) {
      socketRef.current.emit('stop_calling', { gameId });
    }
  };

  // Draw numbers automatically
  useEffect(() => {
    if (numberCalling && gameId) {
      const drawNext = async () => {
        const res = await gameService.drawNumber(gameId);
        const number = res.data.drawn_number;
        setDrawnNumbers((prev) => [...prev, number]);
        setRecentNumbers((prev) => [number, ...prev].slice(0, 5));
        if (drawnNumbers.length + 1 >= NUMBER_RANGE) {
          setNumberCalling(false);
          setGameStatus('finished');
        } else if (numberCalling) {
          timerRef.current = setTimeout(drawNext, playSpeed);
        }
      };
      timerRef.current = setTimeout(drawNext, playSpeed);
      return () => clearTimeout(timerRef.current);
    }
  }, [numberCalling, gameId, playSpeed, drawnNumbers.length]);

  // Winner verification
  const handleVerify = async () => {
    setVerifyResult(null);
    if (!gameId || !cardInput) return;
    const cartelas = await cartelaService.getAllCartelas();
    const cartela = cartelas.data.find(c => c.cartela_number === parseInt(cardInput));
    if (!cartela) {
      setVerifyResult({ valid: false, message: "Cartela didn't get registered" });
      return;
    }
    const res = await gameService.verifyWinner(gameId, cartela.id);
    setVerifyResult(res.data);
    if (socketRef.current && gameId) {
      socketRef.current.emit('winner_verified', { gameId, result: res.data });
    }
  };

  // Reset for new game
  const handleReset = () => {
    setGameId(null);
    setGameStatus('idle');
    setDrawnNumbers([]);
    setRecentNumbers([]);
    setRegisteredCards([]);
    setSelectedCards([]);
    setCardInput('');
    setVerifyResult(null);
    setNumberCalling(false);
    setShowRegisterModal(false);
    setShowStartModal(false);
    setRoundNumber(r => r + 1);
    if (socketRef.current && gameId) {
      socketRef.current.emit('game_reset', { gameId });
    }
  };

  // Card grid for registration
  const renderCardGrid = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 1, maxHeight: 400, overflowY: 'auto', p: 2 }}>
      {Array.from({ length: CARD_COUNT }, (_, i) => i + 1).map((num) => {
        const isSelected = selectedCards.includes(num);
        return (
          <Button
            key={num}
            variant={isSelected ? 'contained' : 'outlined'}
            color={isSelected ? 'warning' : 'primary'}
            sx={{ minWidth: 0, width: 36, height: 36, m: 0.2, borderRadius: '50%', fontWeight: 'bold', border: isSelected ? '2px solid orange' : '1px solid #ccc' }}
            onClick={() => handleCardClick(num)}
          >
            {num}
          </Button>
        );
      })}
    </Box>
  );

  // Main bingo number grid
  const renderNumberGrid = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 0.5, p: 1, background: '#f9f9f9', borderRadius: 2 }}>
      {Array.from({ length: NUMBER_RANGE }, (_, i) => i + 1).map((num) => {
        const isDrawn = drawnNumbers.includes(num);
        return (
          <Box
            key={num}
            sx={{
              width: 28, height: 28, borderRadius: '50%',
              background: isDrawn ? '#ff9800' : '#fff',
              color: isDrawn ? '#fff' : '#333',
              border: isDrawn ? '2px solid #ff9800' : '1px solid #ccc',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14
            }}
          >
            {num}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Typography variant="h5" fontWeight="bold">Piassa Bingo</Typography>
            <Typography variant="subtitle1" color="text.secondary">Round {roundNumber}</Typography>
            <Typography variant="subtitle2" color="text.secondary">Stake: <b>{stake}</b></Typography>
            <Typography variant="subtitle2" color="text.secondary">Pattern: <b>{winningPattern}</b></Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ width: 100, height: 100, borderRadius: '50%', background: '#ff9800', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 'bold', mb: 1 }}>
                {drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : '--'}
              </Box>
              <Typography variant="body2">Current Number</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {recentNumbers.map((num, idx) => (
                  <Chip key={idx} label={num} color="warning" size="small" />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">Recent 5 Numbers</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant="contained" color="primary" fullWidth sx={{ mb: 1 }} onClick={handleStartNewGame} disabled={gameStatus === 'registering' || numberCalling}>Start New Game</Button>
            <Button variant="outlined" color="secondary" fullWidth sx={{ mb: 1 }} onClick={() => setShowRegisterModal(true)} disabled={!gameId || gameStatus !== 'registering'}>Register Cards</Button>
            <Button variant="outlined" color="error" fullWidth sx={{ mb: 1 }} onClick={handleReset}>Reset</Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {renderNumberGrid()}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Play Speed</Typography>
              <Slider
                min={500}
                max={5000}
                step={100}
                value={playSpeed}
                onChange={(_, v) => setPlaySpeed(v)}
                valueLabelDisplay="auto"
                marks={[{ value: 500, label: 'Fast' }, { value: 5000, label: 'Slow' }]}
                disabled={numberCalling}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Winning Pattern</InputLabel>
                <Select value={winningPattern} label="Winning Pattern" onChange={e => setWinningPattern(e.target.value)} disabled={gameStatus !== 'idle'}>
                  {WINNING_PATTERNS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Stake</InputLabel>
                <Select value={stake} label="Stake" onChange={e => setStake(e.target.value)} disabled={gameStatus !== 'idle'}>
                  {STAKES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" color="success" fullWidth onClick={handleStartCalling} disabled={gameStatus !== 'ready' || numberCalling}>Bingo (Start Calling)</Button>
              <Button variant="contained" color="warning" fullWidth sx={{ mt: 1 }} onClick={handleStopCalling} disabled={!numberCalling}>Stop</Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle1">Enter Card Number to Verify</Typography>
              <TextField
                value={cardInput}
                onChange={e => setCardInput(e.target.value)}
                type="number"
                fullWidth
                placeholder="Card Number"
                sx={{ mb: 1 }}
                disabled={!gameId}
              />
              <Button variant="outlined" color="info" fullWidth onClick={handleVerify} disabled={!gameId || !cardInput}>Check</Button>
              {verifyResult && (
                <Box sx={{ mt: 1 }}>
                  <Typography color={verifyResult.valid ? 'success.main' : 'error.main'}>
                    {verifyResult.message || (verifyResult.valid ? 'Valid Bingo!' : 'Invalid Bingo!')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Start Game Modal */}
      <Dialog open={showStartModal} onClose={() => setShowStartModal(false)}>
        <DialogTitle>Start New Game</DialogTitle>
        <DialogContent>
          <Typography>Winning Pattern: <b>{winningPattern}</b></Typography>
          <Typography>Stake: <b>{stake}</b></Typography>
          <Typography>Are you sure you want to start a new game round?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStartModal(false)}>Cancel</Button>
          <Button onClick={confirmStartGame} variant="contained">Start</Button>
        </DialogActions>
      </Dialog>

      {/* Register Cards Modal */}
      <Dialog open={showRegisterModal} onClose={() => setShowRegisterModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Register Cards for This Round</DialogTitle>
        <DialogContent>
          <Typography>Select cards to register (click to select/deselect):</Typography>
          {renderCardGrid()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRegisterModal(false)}>Cancel</Button>
          <Button onClick={handleRegisterCards} variant="contained" disabled={selectedCards.length === 0}>Register</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CashierGame;
