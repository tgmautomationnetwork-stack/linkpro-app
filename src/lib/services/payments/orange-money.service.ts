// Orange Money Service (Cameroon)
// API Documentation: https://developer.orange.com/apis/orange-money-webpay/

interface OrangeMoneyConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  merchantKey: string;
  environment: 'sandbox' | 'production';
}

interface PaymentRequest {
  merchant_key: string;
  currency: 'XAF';
  order_id: string;
  amount: number;
  return_url: string;
  cancel_url: string;
  notif_url: string;
  lang: 'fr' | 'en';
  reference: string;
}

interface PaymentStatus {
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';
  order_id: string;
  amount: number;
  currency: string;
  txnid?: string;
}

export class OrangeMoneyService {
  private static config: OrangeMoneyConfig = {
    apiUrl: process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com/orange-money-webpay',
    clientId: process.env.ORANGE_MONEY_CLIENT_ID || '',
    clientSecret: process.env.ORANGE_MONEY_CLIENT_SECRET || '',
    merchantKey: process.env.ORANGE_MONEY_MERCHANT_KEY || '',
    environment: (process.env.ORANGE_MONEY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  };

  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  /**
   * Get OAuth access token
   */
  private static async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken!;
    }

    try {
      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await fetch(
        `https://api.orange.com/oauth/v3/token`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        }
      );

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.accessToken!;
    } catch (error) {
      console.error('Orange Money token error:', error);
      throw new Error('Failed to get access token');
    }
  }

  /**
   * Initiate payment
   */
  static async initiatePayment(
    amount: number,
    orderId: string,
    reference: string,
    returnUrl: string = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    cancelUrl: string = `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    notifUrl: string = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/orange-money`
  ): Promise<{
    success: boolean;
    paymentUrl?: string;
    paymentToken?: string;
    error?: string;
  }> {
    try {
      if (!this.config.clientId || !this.config.merchantKey) {
        return {
          success: false,
          error: 'Orange Money not configured',
        };
      }

      const token = await this.getAccessToken();

      const requestBody: PaymentRequest = {
        merchant_key: this.config.merchantKey,
        currency: 'XAF',
        order_id: orderId,
        amount: amount,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notif_url: notifUrl,
        lang: 'fr',
        reference,
      };

      const response = await fetch(
        `${this.config.apiUrl}/v1/webpayment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Orange Money payment error:', error);
        return {
          success: false,
          error: 'Payment initiation failed',
        };
      }

      const data = await response.json();

      return {
        success: true,
        paymentUrl: data.payment_url,
        paymentToken: data.pay_token,
      };
    } catch (error) {
      console.error('Orange Money initiatePayment error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Check payment status
   */
  static async getPaymentStatus(orderId: string, paymentToken: string): Promise<{
    success: boolean;
    status?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';
    amount?: number;
    txnid?: string;
    error?: string;
  }> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `${this.config.apiUrl}/v1/transactionstatus`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: orderId,
            pay_token: paymentToken,
          }),
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: 'Status check failed',
        };
      }

      const data: PaymentStatus = await response.json();

      return {
        success: true,
        status: data.status,
        amount: data.amount,
        txnid: data.txnid,
      };
    } catch (error) {
      console.error('Orange Money status check error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Verify webhook notification
   */
  static verifyWebhook(payload: any, signature: string): boolean {
    // Verify webhook signature with merchant secret
    // Implementation depends on Orange Money webhook signature method
    // TODO: Implement signature verification
    return true;
  }
}
