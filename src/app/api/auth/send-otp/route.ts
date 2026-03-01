import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { isValidCameroonPhone } from '@/lib/utils';

// Rate limiting map (in production, use Redis)
const otpAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsapp_number, action } = body;

    // Validation
    if (!whatsapp_number || !action) {
      return NextResponse.json(
        { success: false, error: 'Numéro WhatsApp et action requis' },
        { status: 400 }
      );
    }

    if (!isValidCameroonPhone(whatsapp_number)) {
      return NextResponse.json(
        { success: false, error: 'Format de numéro invalide. Utilisez +237XXXXXXXXX' },
        { status: 400 }
      );
    }

    // Rate limiting (3 attempts per hour per number)
    const now = Date.now();
    const key = whatsapp_number;
    const attempts = otpAttempts.get(key);

    if (attempts && attempts.resetAt > now) {
      if (attempts.count >= 3) {
        const minutesLeft = Math.ceil((attempts.resetAt - now) / 60000);
        return NextResponse.json(
          { success: false, error: `Trop de tentatives. Réessayez dans ${minutesLeft} minutes.` },
          { status: 429 }
        );
      }
      attempts.count++;
    } else {
      otpAttempts.set(key, { count: 1, resetAt: now + 3600000 }); // 1 hour
    }

    const supabase = createServerSupabaseClient();

    // Check if user exists (for login)
    if (action === 'login') {
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('whatsapp_number', whatsapp_number)
        .single();

      if (!existingVendor) {
        return NextResponse.json(
          { success: false, error: 'Aucun compte trouvé avec ce numéro. Créez un compte.' },
          { status: 404 }
        );
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database (expires in 5 minutes)
    const expiresAt = new Date(Date.now() + 300000).toISOString(); // 5 minutes

    const { error: otpError } = await supabase
      .from('otp_codes')
      .upsert({
        phone_number: whatsapp_number,
        code: otp,
        expires_at: expiresAt,
        attempts: 0,
      });

    if (otpError) {
      console.error('OTP storage error:', otpError);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la génération du code' },
        { status: 500 }
      );
    }

    // Send OTP via WhatsApp
    const { WhatsAppService } = await import('@/lib/services/whatsapp.service');
    const sendResult = await WhatsAppService.sendOTP(whatsapp_number, otp);

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${whatsapp_number}: ${otp}`);
      if (!sendResult.success) {
        console.warn(`⚠️ WhatsApp send failed: ${sendResult.error} - OTP still stored`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Code envoyé sur WhatsApp',
      expires_in: 300,
      // Only for development
      dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
