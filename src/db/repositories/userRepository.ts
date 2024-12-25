import db from '../schema';
import type { User } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  static create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, name, phone)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.email, data.passwordHash, data.name, data.phone);
    return this.findById(id);
  }

  static findById(id: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByEmail(email: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static update(id: string, data: Partial<User>) {
    const stmt = db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          profile_picture = COALESCE(?, profile_picture),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(data.name, data.phone, data.profilePicture, id);
    return this.findById(id);
  }
}