import db from '../schema';
import type { Message } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { encryptMessage } from '../../utils/encryption';

export class MessageRepository {
  static create(data: Omit<Message, 'id' | 'createdAt'>) {
    const id = uuidv4();
    const content = data.isEncrypted ? encryptMessage(data.content) : data.content;
    
    const stmt = db.prepare(`
      INSERT INTO messages (id, sender_id, recipient_id, content, is_encrypted)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.senderId, data.recipientId, content, data.isEncrypted);
    return this.findById(id);
  }

  static findById(id: string) {
    const stmt = db.prepare('SELECT * FROM messages WHERE id = ?');
    return stmt.get(id);
  }

  static findConversation(userId1: string, userId2: string) {
    const stmt = db.prepare(`
      SELECT m.*, 
             s.name as sender_name
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      WHERE (m.sender_id = ? AND m.recipient_id = ?)
         OR (m.sender_id = ? AND m.recipient_id = ?)
      ORDER BY m.created_at ASC
    `);
    
    return stmt.all(userId1, userId2, userId2, userId1);
  }
}