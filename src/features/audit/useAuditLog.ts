import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export const useAuditLog = (userId?: string) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const baseQuery = collection(db, 'audit_logs');
      const constraints = [orderBy('timestamp', 'desc'), limit(100)];
      
      if (userId) {
        constraints.push(where('userId', '==', userId));
      }

      const q = query(baseQuery, ...constraints);
      const snapshot = await getDocs(q);
      
      setLogs(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as AuditLog[]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [userId]);

  return { logs, loading, refresh: fetchLogs };
};