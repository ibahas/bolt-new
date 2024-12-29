import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { DateRangePicker } from '../../../components/common/DateRangePicker';
import { StatCard } from '../../../components/dashboard/StatCard';
import { LineChart, BarChart } from '../../../components/charts';
import { fetchAdminStats } from '../../../services/admin';
import { Users, DollarSign, MessageSquare, Ticket } from 'lucide-react';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  
  const { data: stats, isLoading } = useQuery(
    ['adminStats', dateRange],
    () => fetchAdminStats(dateRange),
    { enabled: !!dateRange.start && !!dateRange.end }
  );

  if (isLoading) return <div>Loading statistics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Analytics</h1>
        <DateRangePicker onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          change={stats?.userGrowth || 0}
        />
        <StatCard
          title="Total Transactions"
          value={stats?.totalTransactions || 0}
          icon={DollarSign}
          change={stats?.transactionGrowth || 0}
          prefix="$"
        />
        <StatCard
          title="Active Chats"
          value={stats?.activeChats || 0}
          icon={MessageSquare}
          change={stats?.chatGrowth || 0}
        />
        <StatCard
          title="Open Tickets"
          value={stats?.openTickets || 0}
          icon={Ticket}
          change={stats?.ticketGrowth || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">User Growth</h3>
          <LineChart data={stats?.userGrowthData || []} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Transaction Volume</h3>
          <BarChart data={stats?.transactionVolumeData || []} />
        </div>
      </div>
    </div>
  );
};