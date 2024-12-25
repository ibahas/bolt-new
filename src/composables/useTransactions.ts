import { ref, computed } from 'vue';
import type { Transaction } from '../types';
import { TransactionRepository } from '../db/repositories/transactionRepository';
import { AuditRepository } from '../db/repositories/auditRepository';
import { transactionSchema } from '../utils/validation';
import { useAuth } from './useAuth';

export function useTransactions() {
  const { currentUser } = useAuth();
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);

  const pendingTransactions = computed(() => 
    transactions.value.filter(t => t.status === 'pending')
  );

  async function createTransaction(data: { 
    recipientId: string; 
    amount: number; 
    description?: string 
  }) {
    if (!currentUser.value) throw new Error('Not authenticated');
    
    const validated = transactionSchema.parse(data);
    const transaction = TransactionRepository.create({
      ...validated,
      senderId: currentUser.value.id,
      status: 'pending',
    });

    AuditRepository.log(
      currentUser.value.id, 
      'transaction_created',
      `Amount: ${data.amount}, Recipient: ${data.recipientId}`
    );

    return transaction;
  }

  async function loadUserTransactions() {
    if (!currentUser.value) return;
    
    loading.value = true;
    try {
      transactions.value = TransactionRepository.findByUser(currentUser.value.id);
    } finally {
      loading.value = false;
    }
  }

  return {
    transactions,
    pendingTransactions,
    loading,
    createTransaction,
    loadUserTransactions,
  };
}