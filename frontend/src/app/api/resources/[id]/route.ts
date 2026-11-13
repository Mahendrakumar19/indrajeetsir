import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Resource ID is required' }, { status: 400 });
    }

    // Proxy the delete call to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      await fetch(`${backendUrl}/resources/${id}`, { method: 'DELETE' });
    } catch (apiErr) {
      console.warn('Backend proxy DELETE failed:', apiErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    console.error('DELETE resource error:', err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
