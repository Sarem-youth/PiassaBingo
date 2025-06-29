import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/games/';

class GameService {
  createGame(shopId, settings) {
    return axios.post(API_URL, { shopId, settings }, { headers: authHeader() });
  }

  getAllGames() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getGameById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  updateGame(id, settings, status, drawn_numbers) {
    return axios.put(API_URL + id, { settings, status, drawn_numbers }, { headers: authHeader() });
  }

  deleteGame(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  startGame(id, winning_pattern, stake) {
    return axios.post(API_URL + id + '/start', { winning_pattern, stake }, { headers: authHeader() });
  }

  registerCartela(game_id, cartela_id) {
    return axios.post(API_URL + 'register-cartela', { game_id, cartela_id }, { headers: authHeader() });
  }

  drawNumber(id) {
    return axios.post(API_URL + id + '/draw-number', {}, { headers: authHeader() });
  }

  verifyWinner(game_id, cartela_id) {
    return axios.post(API_URL + 'verify-winner', { game_id, cartela_id }, { headers: authHeader() });
  }
}

export default new GameService();
