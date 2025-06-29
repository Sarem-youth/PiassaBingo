import { supabase } from '../supabase';

const sendCreditToAgent = async (data) => {
  const { data: result, error } = await supabase.from('credits').insert([data]);
  if (error) throw new Error(error.message);
  return result;
};

const getAgentCreditReport = async (params) => {
  const { data, error } = await supabase.from('credits').select('*').match(params);
  if (error) throw new Error(error.message);
  return data;
};

const sendCreditToShop = async (data) => {
  const { data: result, error } = await supabase.from('credits').insert([data]);
  if (error) throw new Error(error.message);
  return result;
};

const getShopCreditReport = async (params) => {
  const { data, error } = await supabase.from('credits').select('*').match(params);
  if (error) throw new Error(error.message);
  return data;
};

const getReceivedCreditReport = async (params) => {
  const { data, error } = await supabase.from('credits').select('*').match(params);
  if (error) throw new Error(error.message);
  return data;
};

const rechargeBalance = async (data) => {
  const { data: result, error } = await supabase.from('credits').insert([data]);
  if (error) throw new Error(error.message);
  return result;
};

export default {
  sendCreditToAgent,
  getAgentCreditReport,
  sendCreditToShop,
  getShopCreditReport,
  getReceivedCreditReport,
  rechargeBalance
};
