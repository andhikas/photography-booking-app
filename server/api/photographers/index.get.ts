import { defineEventHandler, getQuery } from 'h3';
import { useDB } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const query = getQuery(event);

  let whereClauses: string[] = [];
  let params: any[] = [];

  if (query.category && typeof query.category === 'string' && query.category !== 'all') {
    whereClauses.push('category = ?');
    params.push(query.category);
  }

  if (query.location && typeof query.location === 'string') {
    whereClauses.push('location LIKE ?');
    params.push(`%${query.location}%`);
  }

  if (query.minPrice) {
    whereClauses.push('hourly_rate >= ?');
    params.push(query.minPrice);
  }

  if (query.maxPrice) {
    whereClauses.push('hourly_rate <= ?');
    params.push(query.maxPrice);
  }

  const whereStatement = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  try {
    const photographers = db.prepare(`
      SELECT id, name, location, bio, profile_picture, category, tags, hourly_rate 
      FROM photographers
      ${whereStatement}
    `).all(params);

    return photographers;
  } catch (error) {
    console.error('Error fetching photographers:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch photographers',
    });
  }
});
