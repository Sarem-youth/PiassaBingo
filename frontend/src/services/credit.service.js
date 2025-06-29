import axios from 'axios';

const API_URL = 'http://localhost:8080/api/credits';

const sendCreditToAgent = (data) => {
  return axios.post(`${API_URL}/agent`, data);
};

const getAgentCreditReport = (params) => {
  return axios.get(`${API_URL}/agent`, { params });
};

const sendCreditToShop = (data) => {
  return axios.post(`${API_URL}/shop`, data);
};

const getShopCreditReport = (params) => {
  return axios.get(`${API_URL}/shop`, { params });
};

const getReceivedCreditReport = (params) => {
  return axios.get(`${API_URL}/received`, { params });
};

const rechargeBalance = (data) => {
  return axios.post(`${API_URL}/recharge`, data);
};

export default {
  sendCreditToAgent,
  getAgentCreditReport,
  sendCreditToShop,
  getShopCreditReport,
  getReceivedCreditReport,
  rechargeBalance
};
