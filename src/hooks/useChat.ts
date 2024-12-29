import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ChatWebSocket } from '../services/chat/websocket';
import { 
  createChat, 
  sendMessage, 
  getMessages, 
  getUserChats 
} from '../services/chat/api';
import type { Chat, Message, ChatEvent } from '../services/chat/types';

const WEBSOCKET_URL = import.meta.env.VITE_CHAT_WEBSOCKET_URL;

export const useChat = (chatId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [ws] = useState(() => new ChatWebSocket(WEBSOCKET_URL));

  // Load user's chats
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        const userChats = await getUserChats(user.uid);
        setChats(userChats);
      } catch (err) {
        setError(err as Error);
      }
    };

    loadChats();
  }, [user]);

  // Load chat messages
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const chatMessages = await getMessages(chatId);
        setMessages(chatMessages);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  // Handle real-time updates
  useEffect(() => {
    if (!chatId) return;

    const handleMessage = (event: ChatEvent) => {
      if (event.chatId === chatId) {
        setMessages(prev => [event.payload, ...prev]);
      }
    };

    ws.on('message', handleMessage);
    return () => ws.off('message', handleMessage);
  }, [chatId, ws]);

  const send = useCallback(async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!user || !chatId) return;

    try {
      const messageId = await sendMessage(chatId, user.uid, content, type);
      return messageId;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [user, chatId]);

  const startNewChat = useCallback(async (participantIds: string[], type: 'direct' | 'group', metadata?: any) => {
    if (!user) return;

    try {
      const newChatId = await createChat([user.uid, ...participantIds], type, metadata);
      const newChat = await getUserChats(user.uid);
      setChats(newChat);
      return newChatId;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [user]);

  return {
    messages,
    chats,
    loading,
    error,
    send,
    startNewChat
  };
};