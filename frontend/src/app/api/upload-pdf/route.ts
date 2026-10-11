import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to create a clean URL-safe slug from filename or title
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9\-_.]/g, '') // Remove all non-word chars except - .
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const tag = (formData.get('tag') as string) || 'Study Material';
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No PDF file uploaded' }, { status: 400 });
    }

    // Validate mime / extension
    const originalName = file.name || 'document.pdf';
    if (!originalName.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, message: 'Only PDF documents are allowed' }, { status: 400 });
    }

    // Determine slug name for URL
    const rawBase = title.trim() ? title.trim() : path.parse(originalName).name;
    const cleanSlug = slugify(rawBase);
    const finalFileName = `${cleanSlug}.pdf`;

    // Ensure uploads directory exists inside public
    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(publicUploadDir)) {
      fs.mkdirSync(publicUploadDir, { recursive: true });
    }

    const targetFilePath = path.join(publicUploadDir, finalFileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(targetFilePath, buffer);

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const publicUrl = `/uploads/${finalFileName}`;

    return NextResponse.json({
      success: true,
      data: {
        id: `pdf-${Date.now()}`,
        title: title || originalName.replace(/\.pdf$/i, ''),
        description: description || 'Official PDF resource from Indrajeet Sir Mentorship desk.',
        tag: tag || 'Official PDF',
        size: sizeInMB,
        fileUrl: publicUrl,
        fileName: finalFileName,
      },
    });
  } catch (error: any) {
    console.error('PDF upload error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
