// MTN Mobile Money Service (Cameroon)
// API Documentation: https://momodeveloper.mtn.com/

interface MoMoConfig {
  apiUrl: string;
  subscriptionKey: string;
  apiUser: string;
  apiKey: string;
  environment: 'sandbox' | 'production';
}

interface CollectionRequest {
  amount: string;
  currency: 'XAF';
  externalId: string;
  payer: {
    partyIdType: 'MSISDN';
    partyId: string; // Phone number without +
  };
  payerMessage: string;
  payeeNote: string;
}

interface TransactionStatus {
  amount: string;
  currency: string;
  financialTransactionId?: string;
  externalId: string;
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
  reason?: string;
}

export class MTNMoMoService {
  private static config: MoMoConfig = {
    apiUrl: process.env.MTN_MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com',
    subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
    apiUser: process.env.MTN_MOMO_API_USER || '',
    apiKey: process.env.MTN_MOMO_API_KEY || '',
    environment: (process.env.MTN_MOMO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  };

  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  /**
   * Get OAuth access token
   */
  private static async getAccessToken(): Promise<string> {
    // Return cached token if valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken!;
    }

    try {
      const credentials = Buffer.from(`${this.config.apiUser}:${this.config.apiKey}`).toString('base64');

      const response = await fetch(
        `${this.config.apiUrl}/collection/token/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      // Token expires in 3600s, refresh 5min before
      this.tokenExpiry = Date.now() + (3600 - 300) * 1000;

      return this.accessToken!;
    } catch (error) {
      console.error('MTN MoMo token error:', error);
      throw new Error('Failed to get access token');
    }
  }

  /**
   * Request payment from customer
   */
  static async requestToPay(
    amount: number,
    phoneNumber: string,
    externalId: string,
    payerMessage: string = 'LinkPro subscription payment'
  ): Promise<{ success: boolean; referenceId?: string; error?: string }> {
    try {
      if (!this.config.subscriptionKey || !this.config.apiUser) {
        return {
          success: false,
          error: 'MTN MoMo not configured',
        };
      }

      const token = await this.getAccessToken();
      
      // Generate unique reference ID (UUID)
      const referenceId = crypto.randomUUID();

      // Format phone: +237671234567 → 237671234567
      const formattedPhone = phoneNumber.replace(/\+/g, '');

      const requestBody: CollectionRequest = {
        amount: amount.toString(),
        currency: 'XAF',
        externalId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone,
        },
        payerMessage,
        payeeNote: `LinkPro - ${payerMessage}`,
      };

      const response = await fetch(
        `${this.config.apiUrl}/collection/v1_0/requesttopay`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('MTN MoMo request error:', error);
        return {
          success: false,
          error: 'Payment request failed',
        };
      }

      return {
        success: true,
        referenceId,
      };
    } catch (error) {
      console.error('MTN MoMo requestToPay error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Check transaction status
   */
  static async getTransactionStatus(referenceId: string): Promise<{
    success: boolean;
    status?: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
    amount?: string;
    error?: string;
  }> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `${this.config.apiUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: 'Status check failed',
        };
      }

      const data: TransactionStatus = await response.json();

      return {
        success: true,
        status: data.status,
        amount: data.amount,
      };
    } catch (error) {
      console.error('MTN MoMo status check error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Get account balance (for testing)
   */
  static async getBalance(): Promise<{ success: boolean; balance?: string; error?: string }> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `${this.config.apiUrl}/collection/v1_0/account/balance`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      );

      if (!response.ok) {
        return { success: false, error: 'Balance check failed' };
      }

      const data = await response.json();

      return {
        success: true,
        balance: data.availableBalance,
      };
    } catch (error) {
      console.error('MTN MoMo balance error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }
}
