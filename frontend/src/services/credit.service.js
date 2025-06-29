import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/credits';

const sendCreditToAgent = (data) => {
  return axios.post(`${API_URL}/sent-to-agent`, data, { headers: authHeader() });
};

const getAgentCreditReport = (params) => {
  return axios.get(`${API_URL}/sent-to-agent`, { headers: authHeader(), params });
};

const sendCreditToShop = (data) => {
  return axios.post(`${API_URL}/sent-to-shop`, data, { headers: authHeader() });
};

const getShopCreditReport = (params) => {
  return axios.get(`${API_URL}/sent-to-shop`, { headers: authHeader(), params });
};

const getReceivedCreditReport = (params) => {
  return axios.get(`${API_URL}/received`, { headers: authHeader(), params });
};

const rechargeBalance = (data) => {
  return axios.post(`${API_URL}/recharge`, data, { headers: authHeader() });
};

const transferCredit = (senderId, receiverId, amount) => {
    return axios.post(API_URL + '/transfer', { sender_id: senderId, receiver_id: receiverId, amount }, { headers: authHeader() });
}

const getAllCredits = (params) => {
    return axios.get(API_URL, { headers: authHeader(), params });
}

const getCreditsByUser = (userId, params) => {
    return axios.get(API_URL + `/user/${userId}`, { headers: authHeader(), params });
}

export default {
  sendCreditToAgent,
  getAgentCreditReport,
  sendCreditToShop,
  getShopCreditReport,
  getReceivedCreditReport,
  rechargeBalance,
  transferCredit,
  getAllCredits,
  getCreditsByUser
};
