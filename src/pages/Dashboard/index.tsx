import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayouts } from '../../components/layout/DashboardLayout';
import { Overview } from './Overview';
import { Transactions } from './Transactions';
import Messages from './Messages';
import Support from './Support';
import Settings from './Settings';
import AdminUsers from './admin/Users';
import AdminAnalytics from './admin/Analytics';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayouts>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Routes>
    </DashboardLayouts>
  );
};

export default Dashboard;