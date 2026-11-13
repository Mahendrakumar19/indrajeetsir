import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const fileSegments = resolvedParams.file || [];
    if (!fileSegments.length) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const safeRelativePath = fileSegments.join('/');
    // Prevent directory traversal attacks
    if (safeRelativePath.includes('..')) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', safeRelativePath);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    const filename = path.basename(filePath);
    const isDownload = req.nextUrl.searchParams.get('download') === '1';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': isDownload
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
