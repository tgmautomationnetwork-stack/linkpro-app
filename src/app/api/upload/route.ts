import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Fichier requis' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Type de fichier invalide. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux. Maximum 5MB.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

    const uploadFormData = new FormData();
    uploadFormData.append('file', new Blob([buffer], { type: file.type }));
    uploadFormData.append('upload_preset', 'linkpro_products'); // Create this preset in Cloudinary
    uploadFormData.append('folder', `linkpro/${folder}`);
    
    // Transformations for optimization
    uploadFormData.append('transformation', JSON.stringify([
      { quality: 'auto', fetch_format: 'auto' },
      { width: 800, height: 800, crop: 'fill', gravity: 'auto' }
    ]));

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text();
      console.error('Cloudinary upload error:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'upload de l\'image' },
        { status: 500 }
      );
    }

    const cloudinaryData = await cloudinaryResponse.json();

    return NextResponse.json({
      success: true,
      url: cloudinaryData.secure_url,
      public_id: cloudinaryData.public_id,
      width: cloudinaryData.width,
      height: cloudinaryData.height,
      format: cloudinaryData.format,
      size: cloudinaryData.bytes,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'public_id requis' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary using Admin API
    // Note: This requires Cloudinary API key and secret
    const timestamp = Math.round(Date.now() / 1000);
    const signature = generateCloudinarySignature(publicId, timestamp);

    const deleteUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`;

    const deleteFormData = new FormData();
    deleteFormData.append('public_id', publicId);
    deleteFormData.append('signature', signature);
    deleteFormData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    deleteFormData.append('timestamp', timestamp.toString());

    const cloudinaryResponse = await fetch(deleteUrl, {
      method: 'POST',
      body: deleteFormData,
    });

    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary delete error');
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image supprimée',
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Helper to generate Cloudinary signature
function generateCloudinarySignature(publicId: string, timestamp: number): string {
  const crypto = require('crypto');
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash('sha1').update(stringToSign).digest('hex');
}
