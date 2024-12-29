import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const fetchDashboardStats = async () => {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const lastMonth = startOfMonth(subMonths(now, 1));

  // Fetch users
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const totalUsers = usersSnapshot.size;

  // Fetch transactions
  const transactionsSnapshot = await getDocs(
    query(
      collection(db, 'transactions'),
      where('createdAt', '>=', lastMonth),
      orderBy('createdAt', 'desc')
    )
  );

  // Fetch active chats
  const chatsSnapshot = await getDocs(
    query(
      collection(db, 'chats'),
      where('lastMessage.timestamp', '>=', lastMonth)
    )
  );

  // Fetch tickets
  const ticketsSnapshot = await getDocs(
    query(
      collection(db, 'tickets'),
      where('status', '==', 'open')
    )
  );

  // Calculate growth percentages
  // In a real app, you'd compare with previous month's data
  const mockGrowth = () => Math.floor(Math.random() * 21) - 10; // -10 to +10

  return {
    totalUsers,
    totalTransactions: transactionsSnapshot.size,
    activeChats: chatsSnapshot.size,
    openTickets: ticketsSnapshot.size,
    userGrowth: mockGrowth(),
    transactionGrowth: mockGrowth(),
    chatGrowth: mockGrowth(),
    ticketGrowth: mockGrowth(),
    transactionHistory: generateMockTransactionHistory()
  };
};

const generateMockTransactionHistory = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = subMonths(now, i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: Math.floor(Math.random() * 10000)
    });
  }
  
  return data;
};