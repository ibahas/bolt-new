import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  usersByRole: Record<string, number>;
  loginActivity: {
    date: string;
    count: number;
  }[];
}

export const useUserAnalytics = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const usersRef = collection(db, 'users');
      const analyticsRef = collection(db, 'analytics');
      
      // Fetch user counts by role
      const rolesSnapshot = await getDocs(usersRef);
      const usersByRole = rolesSnapshot.docs.reduce((acc, doc) => {
        const role = doc.data().role;
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Fetch today's analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaySnapshot = await getDocs(
        query(analyticsRef, where('date', '>=', today))
      );

      setAnalytics({
        totalUsers: rolesSnapshot.size,
        activeUsers: 0, // This would come from your real-time tracking
        newUsersToday: todaySnapshot.docs[0]?.data().newUsers || 0,
        usersByRole,
        loginActivity: [] // This would be populated with actual login data
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return { analytics, loading, refresh: fetchAnalytics };
};