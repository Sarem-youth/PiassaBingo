import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CashierLogin from './pages/Cashier/Login';
import AdminLogin from './pages/Admin/Login';
import CashierDashboard from './pages/Cashier/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import SentToAgent from './pages/Admin/SentToAgent';
import SentToShop from './pages/Admin/SentToShop';
import ReceivedCredit from './pages/Admin/ReceivedCredit';
import RechargeBalance from './pages/Admin/RechargeBalance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CashierLogin />} />
        <Route path="/cashier/login" element={<CashierLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/cashier/dashboard" element={<CashierDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sent-to-agent" element={<SentToAgent />} />
        <Route path="/admin/sent-to-shop" element={<SentToShop />} />
        <Route path="/admin/received-credit" element={<ReceivedCredit />} />
        <Route path="/admin/recharge-balance" element={<RechargeBalance />} />
      </Routes>
    </Router>
  );
}

export default App;
