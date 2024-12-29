export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  role: 'user' | 'admin';
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  description?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date;
    type: 'text' | 'image';
  };
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  type: 'text' | 'image';
  timestamp: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}