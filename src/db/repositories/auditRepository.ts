import db from '../schema';
import { v4 as uuidv4 } from 'uuid';

export class AuditRepository {
  static log(userId: string | null, action: string, details?: string) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, details)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, userId, action, details);
  }

  static getRecentLogs(limit = 100) {
    const stmt = db.prepare(`
      SELECT l.*, u.name as user_name
      FROM audit_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }
}