import React from 'react';
import { useSystemMetrics } from '../../features/metrics/useSystemMetrics';
import { Activity, Server, AlertTriangle, Clock } from 'lucide-react';

export const SystemHealthDashboard: React.FC = () => {
  const { metrics, loading } = useSystemMetrics();

  if (loading) return <div>Loading system metrics...</div>;
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">System Load</p>
            <p className="text-2xl font-semibold">{metrics.systemLoad}%</p>
          </div>
          <Server className="h-8 w-8 text-indigo-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Error Rate</p>
            <p className="text-2xl font-semibold">{metrics.errorRate}%</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Response Time</p>
            <p className="text-2xl font-semibold">{metrics.responseTime}ms</p>
          </div>
          <Activity className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Uptime</p>
            <p className="text-2xl font-semibold">{metrics.uptime}%</p>
          </div>
          <Clock className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  );
};