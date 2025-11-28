import { defineEventHandler, readBody } from 'h3';
import { useDB } from '../../utils/db';
import { pbkdf2Sync, randomBytes } from 'node:crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name, role } = body;

  // 1. Validate input
  if (!email || !password || !name || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  if (role !== 'client' && role !== 'photographer') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid role specified',
    });
  }

  const db = useDB();

  // 2. Check if user already exists
  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists',
      });
    }
  } catch (error: any) {
    if (error.statusCode === 409) throw error;
    console.error("Error checking for existing user:", error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }

  // 3. Hash password
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  const storedPassword = `${salt}:${hashedPassword}`;

  // 4. Create user in a transaction
  const transaction = db.transaction((user, profile) => {
    const roleId = db.prepare('SELECT id FROM roles WHERE name = ?').get(role)?.id;
    if (!roleId) {
      throw new Error('Role not found');
    }

    const userStmt = db.prepare('INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)');
    const result = userStmt.run(user.email, user.password, roleId);
    const userId = result.lastInsertRowid;

    if (role === 'client') {
      const clientStmt = db.prepare('INSERT INTO clients (user_id, name) VALUES (?, ?)');
      clientStmt.run(userId, profile.name);
    } else if (role === 'photographer') {
      const photographerStmt = db.prepare('INSERT INTO photographers (user_id, name) VALUES (?, ?)');
      photographerStmt.run(userId, profile.name);
    }
    return { id: userId, email: user.email, role: role, name: profile.name };
  });

  try {
    const newUser = transaction({ email, password: storedPassword }, { name });
    
    // For now, just return the created user. Session management will be added with login.
    return {
      statusCode: 201,
      body: {
        message: 'User registered successfully',
        user: newUser
      }
    };
  } catch (error: any) {
    console.error('Error during user registration transaction:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to register user',
    });
  }
});
