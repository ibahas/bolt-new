import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { TransactionRequest, TransactionResponse, TransactionFilter } from './types';

export const createTransaction = async (data: TransactionRequest, userId: string): Promise<string> => {
  const transaction = {
    ...data,
    senderId: userId,
    status: 'pending',
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'transactions'), transaction);
  return docRef.id;
};

export const getTransactions = async (
  userId: string,
  filter?: TransactionFilter
): Promise<TransactionResponse[]> => {
  let q = collection(db, 'transactions');
  const conditions = [];

  if (filter?.type === 'sent') {
    conditions.push(where('senderId', '==', userId));
  } else if (filter?.type === 'received') {
    conditions.push(where('receiverId', '==', userId));
  } else {
    conditions.push(where('senderId', '==', userId));
    // conditions.push(where('receiverId', '==', userId));
  }

  if (filter?.status) {
    conditions.push(where('status', '==', filter.status));
  }

  if (filter?.startDate) {
    conditions.push(where('createdAt', '>=', Timestamp.fromDate(filter.startDate)));
  }

  if (filter?.endDate) {
    conditions.push(where('createdAt', '<=', Timestamp.fromDate(filter.endDate)));
  }

  conditions.push(orderBy('createdAt', 'desc'));

  q = query(q, ...conditions);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as TransactionResponse[];
};