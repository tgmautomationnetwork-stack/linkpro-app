import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MTNMoMoService } from '@/lib/services/payments/mtn-momo.service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, plan, phone_number } = body;

    // Validate input
    if (!amount || !plan || !phone_number) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    const validAmounts: Record<string, number> = {
      pro: 5000,
      business: 15000,
    };

    if (validAmounts[plan] !== amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount for plan' },
        { status: 400 }
      );
    }

    // Generate external ID
    const externalId = `linkpro_${plan}_${Date.now()}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        vendor_id: user.id,
        amount,
        currency: 'XAF',
        method: 'mtn_momo',
        status: 'pending',
        subscription_plan: plan,
        subscription_duration: 30, // days
        metadata: {
          phone_number,
          external_id: externalId,
        },
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      return NextResponse.json(
        { success: false, error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    // Request payment from MTN MoMo
    const result = await MTNMoMoService.requestToPay(
      amount,
      phone_number,
      externalId,
      `LinkPro ${plan.toUpperCase()} - 30 days`
    );

    if (!result.success) {
      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return NextResponse.json(
        { success: false, error: result.error || 'Payment request failed' },
        { status: 500 }
      );
    }

    // Update payment with reference ID
    await supabase
      .from('payments')
      .update({
        momo_transaction_id: result.referenceId,
      })
      .eq('id', payment.id);

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      reference_id: result.referenceId,
      message: 'Payment initiated. Please approve on your phone.',
    });

  } catch (error) {
    console.error('MTN MoMo payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
