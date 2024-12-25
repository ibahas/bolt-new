import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Transaction } from '../types';
import { useTransactions } from '../composables/useTransactions';

export const useTransactionStore = defineStore('transactions', () => {
  const { createTransaction, loadUserTransactions } = useTransactions();
  const transactions = ref<Transaction[]>([]);
  const isLoading = ref(false);

  return {
    transactions,
    isLoading,
    createTransaction,
    loadUserTransactions
  };
});