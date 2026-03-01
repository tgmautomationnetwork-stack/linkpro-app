import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MTNMoMoService } from '@/lib/services/payments/mtn-momo.service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Payment ID required' },
        { status: 400 }
      );
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('vendor_id', user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'success' || payment.status === 'failed') {
      return NextResponse.json({
        success: true,
        status: payment.status,
        amount: payment.amount,
      });
    }

    const providerStatus = await MTNMoMoService.getTransactionStatus(
      payment.momo_transaction_id
    );

    if (!providerStatus.success) {
      return NextResponse.json(
        { success: false, error: providerStatus.error },
        { status: 500 }
      );
    }

    const statusMap: Record<string, string> = {
      'SUCCESSFUL': 'success',
      'FAILED': 'failed',
      'PENDING': 'pending',
    };

    const newStatus = statusMap[providerStatus.status || 'PENDING'] || 'pending';
    const updates: any = { status: newStatus };

    if (newStatus === 'success') {
      updates.completed_at = new Date().toISOString();

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await supabase
        .from('vendors')
        .update({
          subscription_plan: payment.subscription_plan,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('id', user.id);
    }

    await supabase
      .from('payments')
      .update(updates)
      .eq('id', payment.id);

    return NextResponse.json({
      success: true,
      status: newStatus,
      amount: payment.amount,
      plan: payment.subscription_plan,
    });

  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
      );
  }
}
