import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createTransaction, getTransactions } from '../services/transactions/api';
import type { TransactionRequest, TransactionFilter } from '../services/transactions/types';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useTransactions = (filter?: TransactionFilter) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery(
    ['transactions', user?.id, filter],
    () => getTransactions(user!.id, filter),
    {
      enabled: !!user,
    }
  );

  const { mutate: sendMoney } = useMutation(
    (data: TransactionRequest) => createTransaction(data, user!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions']);
        toast.success('Transaction initiated successfully');
      },
      onError: () => {
        toast.error('Failed to create transaction');
      },
    }
  );

  return {
    transactions,
    isLoading,
    sendMoney,
  };
};