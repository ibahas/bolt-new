import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Chat, Message, ChatSubscription } from './types';

export const createChat = async (participants: string[], type: 'direct' | 'group', metadata?: any): Promise<string> => {
  const chat: Omit<Chat, 'id'> = {
    type,
    participants,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata
  };

  const docRef = await addDoc(collection(db, 'chats'), chat);
  
  // Create chat subscriptions for all participants
  const subscriptionPromises = participants.map(userId => 
    addDoc(collection(db, 'chatSubscriptions'), {
      userId,
      chatId: docRef.id,
      role: 'member',
      notifications: true,
      joinedAt: new Date()
    })
  );

  await Promise.all(subscriptionPromises);
  return docRef.id;
};

export const sendMessage = async (chatId: string, senderId: string, content: string, type: 'text' | 'image' | 'file'): Promise<string> => {
  const message: Omit<Message, 'id'> = {
    chatId,
    senderId,
    content,
    type,
    createdAt: new Date(),
    status: 'sent'
  };

  const docRef = await addDoc(collection(db, 'messages'), message);
  
  // Update chat's last message
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: {
      content,
      senderId,
      timestamp: new Date()
    },
    updatedAt: new Date()
  });

  return docRef.id;
};

export const getMessages = async (chatId: string, limit = 50): Promise<Message[]> => {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'desc'),
    limit(limit)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Message[];
};

export const getUserChats = async (userId: string): Promise<Chat[]> => {
  const subscriptionsQuery = query(
    collection(db, 'chatSubscriptions'),
    where('userId', '==', userId)
  );

  const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
  const chatIds = subscriptionsSnapshot.docs.map(doc => doc.data().chatId);

  const chatsQuery = query(
    collection(db, 'chats'),
    where('__name__', 'in', chatIds)
  );

  const chatsSnapshot = await getDocs(chatsQuery);
  return chatsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    lastMessage: doc.data().lastMessage ? {
      ...doc.data().lastMessage,
      timestamp: doc.data().lastMessage.timestamp.toDate()
    } : undefined
  })) as Chat[];
};