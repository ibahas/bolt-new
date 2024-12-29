import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface SystemMetrics {
  activeUsers: number;
  totalTransactions: number;
  systemLoad: number;
  errorRate: number;
  responseTime: number;
  uptime: number;
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const metricsRef = collection(db, 'system_metrics');
      const snapshot = await getDocs(query(metricsRef, limit(1)));
      
      if (!snapshot.empty) {
        setMetrics(snapshot.docs[0].data() as SystemMetrics);
      }
    } catch (error) {
      console.error('Error fetching system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, refresh: fetchMetrics };
};