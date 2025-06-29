import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/users';

const getUsers = (params) => {
  return axios.get(API_URL, { headers: authHeader(), params });
};

const createUser = (data) => {
  return axios.post(API_URL, data, { headers: authHeader() });
};

const updateUser = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
};

const deleteUser = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
