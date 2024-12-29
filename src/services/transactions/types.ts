export interface TransactionRequest {
  amount: number;
  description?: string;
  receiverId: string;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  description?: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  status?: 'pending' | 'completed' | 'failed';
  type?: 'sent' | 'received';
}