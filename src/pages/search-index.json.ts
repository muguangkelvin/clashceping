import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const GET: APIRoute = async () => {
  const filePath = path.join(process.cwd(), 'public/search-index.json');
  if (fs.existsSync(filePath)) {
    const jsonStr = fs.readFileSync(filePath, 'utf-8');
    return new Response(jsonStr, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
  
  return new Response(JSON.stringify({ error: 'Search index not generated yet' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
};
