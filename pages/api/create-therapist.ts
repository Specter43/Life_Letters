import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const result =
      await sql`SELECT * FROM therapist`;
    return response.status(200).json({ result });
  } catch (error) {
    return response.status(500).json({ error });
  }
}