import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api';

const getDashboardData = (params) => {
  return axios.get(`${API_URL}/dashboard`, { headers: authHeader(), params });
};

const getAgents = () => {
  return axios.get(`${API_URL}/users?roles=["super agent"]`, { headers: authHeader() });
}

const getShops = () => {
  return axios.get(`${API_URL}/users?roles=["shop"]`, { headers: authHeader() });
}

export default {
    getDashboardData,
    getAgents,
    getShops,
};
