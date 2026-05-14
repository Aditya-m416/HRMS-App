import { get, run } from '../config/database.js';

export function findUserByEmail(email) {
  return get(
    `SELECT * FROM users WHERE email = :email`,
    { email }
  );
}

export function findUserById(id) {
  return get(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = :id`,
    { id }
  );
}

export function createUser({ name, email, password, role = 'employee' }) {
  const result = run(
    `INSERT INTO users (name, email, password, role)
     VALUES (:name, :email, :password, :role)`,
    {
      name,
      email,
      password,
      role,
    }
  );

  return findUserById(result.lastInsertRowid);
}