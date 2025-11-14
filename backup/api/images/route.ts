import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || '24', 10);

    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ items: [], total: 0, page, size });
    }
    const files = fs
      .readdirSync(imagesDir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));

    const start = (page - 1) * size;
    const end = start + size;
    const slice = files.slice(start, end).map((file) => ({
      src: `/images/${file}`,
      alt: 'Портфолио Золотой Дуб'
    }));

    return NextResponse.json({ items: slice, total: files.length, page, size });
  } catch (e) {
    return NextResponse.json({ items: [], total: 0 }, { status: 500 });
  }
}


