import { defineEventHandler, readBody, createError } from 'h3';
import { useDB } from '../../utils/db';
import { pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { useSession } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email or password',
    });
  }

  const db = useDB();

  // Find user by email
  const user = db.prepare(`
    SELECT u.id, u.email, u.password, r.name as role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
  `).get(email);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Verify password
  const [salt, storedHash] = user.password.split(':');
  const providedHash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // Secure comparison
  const areHashesEqual = timingSafeEqual(Buffer.from(providedHash), Buffer.from(storedHash));

  if (!areHashesEqual) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Set up session
  const session = await useSession(event, {
    password: process.env.NUXT_SESSION_PASSWORD || 'a-very-secret-and-long-password-for-session-encryption', // Should be in .env
    maxAge: 60 * 60 * 24 * 7, // 1 week
    name: 'lensconnect_session',
  });

  const userData = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  
  await session.update({ user: userData });
  
  return {
    user: userData,
  };
});
