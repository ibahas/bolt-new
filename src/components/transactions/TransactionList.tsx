import React from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { TransactionResponse } from '../../services/transactions/types';

interface Props {
  transactions: TransactionResponse[];
  userId: string;
}

export const TransactionList: React.FC<Props> = ({ transactions, userId }) => {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              transaction.senderId === userId ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {transaction.senderId === userId ? (
                <ArrowUpRight className="h-5 w-5 text-red-600" />
              ) : (
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {transaction.senderId === userId ? 'Sent' : 'Received'}
              </p>
              <p className="text-sm text-gray-500">
                {format(transaction.createdAt, 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-medium ${
              transaction.senderId === userId ? 'text-red-600' : 'text-green-600'
            }`}>
              {transaction.senderId === userId ? '-' : '+'}${transaction.amount}
            </p>
            <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};