export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  sender_id: string;
  recipient_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_encrypted: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  details?: string;
  created_at: string;
}