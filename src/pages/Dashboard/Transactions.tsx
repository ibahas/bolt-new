import React, { useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionList } from "../../components/transactions/TransactionList";
import { SendMoneyForm } from "../../components/transactions/SendMoneyForm";
import { useAuth } from "../../hooks/useAuth";

export const Transactions = () => {
  const { user } = useAuth();
  const [showSendMoney, setShowSendMoney] = useState(false);
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => setShowSendMoney(!showSendMoney)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showSendMoney ? "Cancel" : "Send Money"}
        </button>
      </div>

      {showSendMoney && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Send Money</h2>
          <SendMoneyForm />
        </div>
      )}

      {transactions && transactions.length > 0 ? (
        <TransactionList transactions={transactions} userId={user!.i/d} />
      ) : (
        <p className="text-center text-gray-500">No transactions found</p>
      )}
    </div>
  );
};
