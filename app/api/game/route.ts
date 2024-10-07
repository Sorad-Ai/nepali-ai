import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Serve the HTML file
export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'index.html');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return new NextResponse(fileContent, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
