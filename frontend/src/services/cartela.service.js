import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/cartelas/';

class CartelaService {
  createCartela(cartela_number, status, cartela_group_id) {
    return axios.post(API_URL, { cartela_number, status, cartela_group_id }, { headers: authHeader() });
  }

  getAllCartelas() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getCartelaById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  updateCartela(id, cartela_number, status, cartela_group_id) {
    return axios.put(API_URL + id, { cartela_number, status, cartela_group_id }, { headers: authHeader() });
  }

  deleteCartela(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new CartelaService();
