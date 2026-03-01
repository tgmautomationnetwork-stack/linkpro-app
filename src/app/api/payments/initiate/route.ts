import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { initiatePayment, PaymentMethod } from '@/lib/payments';
import { isValidCameroonPhone } from '@/lib/utils';

// POST /api/payments/initiate - Initiate Mobile Money payment
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

    const body = await request.json();
    const { method, phone_number, plan } = body;

    // Validation
    if (!method || !phone_number || !plan) {
      return NextResponse.json(
        { success: false, error: 'Méthode, numéro et plan requis' },
        { status: 400 }
      );
    }

    if (!['mtn_momo', 'orange_money'].includes(method)) {
      return NextResponse.json(
        { success: false, error: 'Méthode de paiement invalide' },
        { status: 400 }
      );
    }

    if (!['pro', 'business'].includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Plan invalide' },
        { status: 400 }
      );
    }

    if (!isValidCameroonPhone(phone_number)) {
      return NextResponse.json(
        { success: false, error: 'Format de numéro invalide' },
        { status: 400 }
      );
    }

    // Get vendor
    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', user.user_metadata.vendor_id)
      .single();

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendeur non trouvé' },
        { status: 404 }
      );
    }

    // Calculate amount
    const amounts = {
      pro: 5000, // 5,000 FCFA/month
      business: 15000, // 15,000 FCFA/month
    };
    const amount = amounts[plan as 'pro' | 'business'];

    // Initiate payment
    const paymentResult = await initiatePayment(
      {
        vendor_id: vendor.id,
        amount,
        phone_number,
        subscription_plan: plan,
        subscription_duration: 30, // days
      },
      method as PaymentMethod
    );

    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, error: paymentResult.error },
        { status: 500 }
      );
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        vendor_id: vendor.id,
        amount,
        currency: 'XAF',
        method,
        status: paymentResult.status,
        momo_transaction_id: paymentResult.transaction_id,
        subscription_plan: plan,
        subscription_duration: 30,
        metadata: {
          phone_number,
          payment_url: paymentResult.payment_url,
        },
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'enregistrement du paiement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      transaction_id: paymentResult.transaction_id,
      status: paymentResult.status,
      payment_url: paymentResult.payment_url,
      message: paymentResult.payment_url 
        ? 'Redirigez vers payment_url pour compléter le paiement'
        : 'Confirmez le paiement sur votre téléphone',
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
