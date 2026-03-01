/**
 * Mobile Money Integration - Cameroon
 * Supports: MTN Mobile Money + Orange Money
 */

export type PaymentMethod = 'mtn_momo' | 'orange_money';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface PaymentRequest {
  vendor_id: string;
  amount: number;
  phone_number: string;
  subscription_plan: 'pro' | 'business';
  subscription_duration?: number;
}

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  status: PaymentStatus;
  error?: string;
  payment_url?: string;
}

/**
 * MTN MOBILE MONEY INTEGRATION
 * 
 * Options:
 * 1. MTN MoMo API Officiel (Sandbox gratuit, Prod payant)
 * 2. Flutterwave (Agrégateur, 1.4% fee)
 * 3. Paystack (Agrégateur, 1.5% fee)
 */

/**
 * OPTION 1: MTN MoMo API Direct (Recommandé pour prod)
 * Docs: https://momodeveloper.mtn.com/
 */
export async function initiateMTNMoMoPayment(data: PaymentRequest): Promise<PaymentResponse> {
  try {
    const apiUser = process.env.MTN_MOMO_API_USER;
    const apiKey = process.env.MTN_MOMO_API_KEY;
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
    const environment = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox'; // sandbox | production

    if (!apiUser || !apiKey || !subscriptionKey) {
      return {
        success: false,
        status: 'failed',
        error: 'MTN MoMo credentials missing',
      };
    }

    // Step 1: Get Access Token
    const tokenResponse = await fetch(
      `https://${environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com/collection/token/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to get MTN access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Request to Pay
    const referenceId = `linkpro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const paymentResponse = await fetch(
      `https://${environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com/collection/v1_0/requesttopay`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': environment,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount.toString(),
          currency: 'XAF',
          externalId: data.vendor_id,
          payer: {
            partyIdType: 'MSISDN',
            partyId: data.phone_number.replace(/\+237/g, '237').replace(/\s/g, ''),
          },
          payerMessage: `Abonnement LinkPro ${data.subscription_plan.toUpperCase()}`,
          payeeNote: `Payment for vendor ${data.vendor_id}`,
        }),
      }
    );

    if (!paymentResponse.ok) {
      const error = await paymentResponse.text();
      console.error('MTN payment error:', error);
      return {
        success: false,
        status: 'failed',
        error: 'Payment initiation failed',
      };
    }

    // Step 3: Return pending status (will be confirmed via webhook/polling)
    return {
      success: true,
      transaction_id: referenceId,
      status: 'pending',
    };

  } catch (error: any) {
    console.error('MTN MoMo error:', error);
    return {
      success: false,
      status: 'failed',
      error: error.message || 'Payment failed',
    };
  }
}

/**
 * Check MTN MoMo payment status
 */
export async function checkMTNMoMoStatus(transactionId: string): Promise<PaymentStatus> {
  try {
    const apiUser = process.env.MTN_MOMO_API_USER;
    const apiKey = process.env.MTN_MOMO_API_KEY;
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
    const environment = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox';

    // Get access token
    const tokenResponse = await fetch(
      `https://${environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com/collection/token/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': subscriptionKey!,
        },
      }
    );

    const tokenData = await tokenResponse.json();

    // Check status
    const statusResponse = await fetch(
      `https://${environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com/collection/v1_0/requesttopay/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'X-Target-Environment': environment,
          'Ocp-Apim-Subscription-Key': subscriptionKey!,
        },
      }
    );

    const statusData = await statusResponse.json();

    // Map MTN status to our status
    switch (statusData.status) {
      case 'SUCCESSFUL':
        return 'success';
      case 'FAILED':
        return 'failed';
      case 'PENDING':
      default:
        return 'pending';
    }

  } catch (error) {
    console.error('Check MTN status error:', error);
    return 'failed';
  }
}

/**
 * ORANGE MONEY INTEGRATION
 * Docs: https://developer.orange.com/apis/orange-money-webpay/
 */
export async function initiateOrangeMoneyPayment(data: PaymentRequest): Promise<PaymentResponse> {
  try {
    const merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY;
    const apiUrl = process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com/orange-money-webpay';

    if (!merchantKey) {
      return {
        success: false,
        status: 'failed',
        error: 'Orange Money credentials missing',
      };
    }

    const orderId = `LINKPRO_${Date.now()}`;
    const amount = data.amount;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payment/callback`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade`;

    // Create payment
    const response = await fetch(`${apiUrl}/v1/webpayment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${merchantKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_key: merchantKey,
        currency: 'XAF',
        order_id: orderId,
        amount: amount,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notif_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/orange-money`,
        lang: 'fr',
        reference: data.vendor_id,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Orange Money error:', error);
      return {
        success: false,
        status: 'failed',
        error: 'Payment initiation failed',
      };
    }

    const result = await response.json();

    return {
      success: true,
      transaction_id: orderId,
      status: 'pending',
      payment_url: result.payment_url, // Redirect user here
    };

  } catch (error: any) {
    console.error('Orange Money error:', error);
    return {
      success: false,
      status: 'failed',
      error: error.message || 'Payment failed',
    };
  }
}

/**
 * OPTION 3: FLUTTERWAVE (Agrégateur - Plus facile)
 * Supporte MTN + Orange + cartes
 * Docs: https://developer.flutterwave.com/docs/direct-charge/mobile-money-cameroon
 */
export async function initiateFlutterwavePayment(
  data: PaymentRequest,
  method: PaymentMethod
): Promise<PaymentResponse> {
  try {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) {
      return {
        success: false,
        status: 'failed',
        error: 'Flutterwave credentials missing',
      };
    }

    const txRef = `LINKPRO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await fetch('https://api.flutterwave.com/v3/charges?type=mobile_money_cameroon', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: data.amount,
        currency: 'XAF',
        network: method === 'mtn_momo' ? 'MTN' : 'ORANGE',
        email: `vendor_${data.vendor_id}@linkpro.cm`,
        phone_number: data.phone_number,
        fullname: 'LinkPro User',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Flutterwave error:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Payment failed',
      };
    }

    const result = await response.json();

    return {
      success: true,
      transaction_id: txRef,
      status: 'pending',
      payment_url: result.meta?.authorization?.redirect,
    };

  } catch (error: any) {
    console.error('Flutterwave error:', error);
    return {
      success: false,
      status: 'failed',
      error: error.message || 'Payment failed',
    };
  }
}

/**
 * Main payment function - routes to correct provider
 */
export async function initiatePayment(
  data: PaymentRequest,
  method: PaymentMethod
): Promise<PaymentResponse> {
  // Use Flutterwave if available (easiest integration)
  if (process.env.FLUTTERWAVE_SECRET_KEY) {
    return await initiateFlutterwavePayment(data, method);
  }

  // Otherwise use direct APIs
  if (method === 'mtn_momo') {
    return await initiateMTNMoMoPayment(data);
  }

  if (method === 'orange_money') {
    return await initiateOrangeMoneyPayment(data);
  }

  return {
    success: false,
    status: 'failed',
    error: 'No payment provider configured',
  };
}
