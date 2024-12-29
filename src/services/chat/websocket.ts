import { auth } from '../../config/firebase';
import { ChatEvent } from './types';

class ChatWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private messageQueue: ChatEvent[] = [];
  private eventListeners: Map<string, Set<(event: ChatEvent) => void>> = new Map();

  constructor(private baseUrl: string) {
    this.connect();
  }

  private async connect() {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('No auth token available');

      this.ws = new WebSocket(`${this.baseUrl}?token=${token}`);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.flushMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const chatEvent: ChatEvent = JSON.parse(event.data);
        this.dispatchEvent(chatEvent);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, this.reconnectTimeout * Math.pow(2, this.reconnectAttempts));
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const event = this.messageQueue.shift();
      if (event) this.send(event);
    }
  }

  public send(event: ChatEvent) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    } else {
      this.messageQueue.push(event);
    }
  }

  public on(eventType: string, callback: (event: ChatEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)?.add(callback);
  }

  public off(eventType: string, callback: (event: ChatEvent) => void) {
    this.eventListeners.get(eventType)?.delete(callback);
  }

  private dispatchEvent(event: ChatEvent) {
    this.eventListeners.get(event.type)?.forEach(callback => callback(event));
  }

  public disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}