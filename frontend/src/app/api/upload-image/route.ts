import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No image file uploaded' }, { status: 400 });
    }

    // Validate mime / extension
    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
      return NextResponse.json(
        { success: false, message: 'Only JPG, PNG, WebP, SVG, and GIF images are allowed' },
        { status: 400 }
      );
    }

    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(publicUploadDir)) {
      fs.mkdirSync(publicUploadDir, { recursive: true });
    }

    const finalFileName = `indrajeet-hero-${Date.now()}${ext}`;
    const targetFilePath = path.join(publicUploadDir, finalFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
    });
  } catch (error: unknown) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Image upload failed' },
      { status: 500 }
    );
  }
}
