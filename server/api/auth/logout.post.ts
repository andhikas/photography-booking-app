import { defineEventHandler, useSession } from 'h3';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.NUXT_SESSION_PASSWORD || 'a-very-secret-and-long-password-for-session-encryption',
    name: 'lensconnect_session',
  });

  await session.clear();

  return { message: 'Logged out successfully' };
});
