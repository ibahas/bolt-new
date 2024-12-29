import React from 'react';
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, MessageSquare, Ticket } from 'lucide-react';
import { fetchDashboardStats } from '../../services/stats';

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
      </div>
      <div className="p-3 bg-indigo-100 rounded-full">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
    </div>
    <div className="mt-4">
      <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
      <span className="text-sm text-gray-600 ml-2">vs last month</span>
    </div>
  </div>
);

const Overview = () => {
  const { data: stats, isLoading } = useQuery('dashboardStats', fetchDashboardStats);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          change={stats.userGrowth}
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={DollarSign}
          change={stats.transactionGrowth}
        />
        <StatCard
          title="Active Chats"
          value={stats.activeChats}
          icon={MessageSquare}
          change={stats.chatGrowth}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={Ticket}
          change={stats.ticketGrowth}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.transactionHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};