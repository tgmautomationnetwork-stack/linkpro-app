import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { isValidCameroonPhone, isValidUsername } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsapp_number, code, username, full_name } = body;

    // Validation
    if (!whatsapp_number || !code) {
      return NextResponse.json(
        { success: false, error: 'Numéro WhatsApp et code requis' },
        { status: 400 }
      );
    }

    if (!isValidCameroonPhone(whatsapp_number)) {
      return NextResponse.json(
        { success: false, error: 'Format de numéro invalide' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', whatsapp_number)
      .eq('code', code)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json(
        { success: false, error: 'Code incorrect' },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date(otpData.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Code expiré. Demandez un nouveau code.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      return NextResponse.json(
        { success: false, error: 'Trop de tentatives. Demandez un nouveau code.' },
        { status: 429 }
      );
    }

    // Check if vendor exists
    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('whatsapp_number', whatsapp_number)
      .single();

    let vendor;

    if (existingVendor) {
      // Login flow
      vendor = existingVendor;
    } else {
      // Signup flow - create new vendor
      if (!username || !full_name) {
        return NextResponse.json(
          { success: false, error: 'Nom complet et username requis pour créer un compte' },
          { status: 400 }
        );
      }

      if (!isValidUsername(username)) {
        return NextResponse.json(
          { success: false, error: 'Format de username invalide' },
          { status: 400 }
        );
      }

      // Check username availability
      const { data: existingUsername } = await supabase
        .from('vendors')
        .select('id')
        .eq('username', username.toLowerCase())
        .single();

      if (existingUsername) {
        return NextResponse.json(
          { success: false, error: 'Ce nom d\'utilisateur est déjà pris' },
          { status: 409 }
        );
      }

      // Create vendor
      const { data: newVendor, error: createError } = await supabase
        .from('vendors')
        .insert({
          username: username.toLowerCase(),
          full_name: full_name,
          whatsapp_number: whatsapp_number,
          subscription_plan: 'free',
          theme_color: '#7030A0',
          is_active: true,
        })
        .select()
        .single();

      if (createError) {
        console.error('Vendor creation error:', createError);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de la création du compte' },
          { status: 500 }
        );
      }

      vendor = newVendor;
    }

      // Delete used OTP
    await supabase
      .from('otp_codes')
      .delete()
      .eq('phone_number', whatsapp_number);

    // Create/login user in Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: `${vendor.id}@linkpro.local`,
      password: vendor.id,
    });

    // If user doesn't exist, create them
    if (signInError?.message?.includes('Invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: `${vendor.id}@linkpro.local`,
        password: vendor.id,
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
      }
    }

    return NextResponse.json({
      success: true,
      vendor: {
        id: vendor.id,
        username: vendor.username,
        full_name: vendor.full_name,
      },
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
