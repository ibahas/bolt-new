import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Transaction, User, AuditLog } from '../types';

export const useAdminStore = defineStore('admin', () => {
  const transactions = ref<Transaction[]>([]);
  const users = ref<User[]>([]);
  const auditLogs = ref<AuditLog[]>([]);
  const isLoading = ref(false);

  async function fetchTransactionStats() {
    // Implementation will use the repositories
    return [
      { name: 'Total Transactions', value: '0' },
      { name: 'Pending Approval', value: '0' },
      { name: 'Today\'s Volume', value: '$0' }
    ];
  }

  async function fetchUserStats() {
    // Implementation will use the repositories
    return [
      { name: 'Total Users', value: '0' },
      { name: 'Active Today', value: '0' },
      { name: 'New This Week', value: '0' }
    ];
  }

  async function approveTransaction(transactionId: string) {
    // Implementation will use the TransactionRepository
  }

  async function rejectTransaction(transactionId: string) {
    // Implementation will use the TransactionRepository
  }

  return {
    transactions,
    users,
    auditLogs,
    isLoading,
    fetchTransactionStats,
    fetchUserStats,
    approveTransaction,
    rejectTransaction
  };
});