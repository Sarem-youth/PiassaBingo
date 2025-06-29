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
import SuperAgents from './pages/Admin/SuperAgents';
import Shops from './pages/Admin/Shops';
import GameManagement from './pages/Admin/GameManagement';
import CartelaManagement from './pages/Admin/CartelaManagement';
import AdminLayout from './components/AdminLayout';
import CashierLayout from './components/CashierLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cashier/login" element={<CashierLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="super-agents" element={<SuperAgents />} />
          <Route path="shops" element={<Shops />} />
          <Route path="sent-to-agent" element={<SentToAgent />} />
          <Route path="sent-to-shop" element={<SentToShop />} />
          <Route path="received-credit" element={<ReceivedCredit />} />
          <Route path="recharge-balance" element={<RechargeBalance />} />
          <Route path="game-management" element={<GameManagement />} />
          <Route path="cartela-management" element={<CartelaManagement />} />
        </Route>

        <Route path="/cashier" element={<CashierLayout />}>
          <Route path="dashboard" element={<CashierDashboard />} />
        </Route>

        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
