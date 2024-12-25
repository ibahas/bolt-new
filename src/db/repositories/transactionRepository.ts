import db from '../schema';
import type { Transaction } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class TransactionRepository {
  static create(data: Omit<Transaction, 'id' | 'createdAt'>) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO transactions (id, sender_id, recipient_id, amount, status, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.senderId, data.recipientId, data.amount, data.status, data.description);
    return this.findById(id);
  }

  static findById(id: string) {
    const stmt = db.prepare('SELECT * FROM transactions WHERE id = ?');
    return stmt.get(id);
  }

  static findByUser(userId: string) {
    const stmt = db.prepare(`
      SELECT t.*, 
             s.name as sender_name, 
             r.name as recipient_name
      FROM transactions t
      JOIN users s ON t.sender_id = s.id
      JOIN users r ON t.recipient_id = r.id
      WHERE t.sender_id = ? OR t.recipient_id = ?
      ORDER BY t.created_at DESC
    `);
    
    return stmt.all(userId, userId);
  }

  static updateStatus(id: string, status: Transaction['status']) {
    const stmt = db.prepare('UPDATE transactions SET status = ? WHERE id = ?');
    stmt.run(status, id);
    return this.findById(id);
  }
}