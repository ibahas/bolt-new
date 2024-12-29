export interface Message {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  type: 'text' | 'image' | 'file';
  createdAt: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date;
  };
  metadata?: {
    groupName?: string;
    groupAvatar?: string;
    isEncrypted?: boolean;
  };
}

export interface ChatSubscription {
  userId: string;
  chatId: string;
  role: 'admin' | 'member';
  notifications: boolean;
  joinedAt: Date;
}

export interface ChatEvent {
  type: 'message' | 'typing' | 'presence' | 'read';
  payload: any;
  timestamp: number;
  chatId: string;
  senderId: string;
}