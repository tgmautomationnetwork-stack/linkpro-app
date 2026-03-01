// WhatsApp Business API Service
// Supports both WhatsApp Cloud API and Evolution API

interface WhatsAppConfig {
  provider: 'cloud' | 'evolution';
  // Cloud API
  phoneNumberId?: string;
  accessToken?: string;
  // Evolution API
  evolutionUrl?: string;
  evolutionToken?: string;
  evolutionInstance?: string;
}

export class WhatsAppService {
  private static config: WhatsAppConfig = {
    provider: (process.env.WHATSAPP_PROVIDER as 'cloud' | 'evolution') || 'cloud',
    // Cloud API
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    // Evolution API
    evolutionUrl: process.env.WHATSAPP_API_URL,
    evolutionToken: process.env.WHATSAPP_API_TOKEN,
    evolutionInstance: process.env.WHATSAPP_INSTANCE_NAME,
  };

  /**
   * Send OTP code via WhatsApp
   */
  static async sendOTP(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Format: +237XXXXXXXXX → 237XXXXXXXXX
      const formattedNumber = phoneNumber.replace(/\+/g, '');

      const message = `Votre code LinkPro : *${code}*\n\nCe code expire dans 5 minutes.\n\nNe partagez jamais ce code.`;

      if (this.config.provider === 'cloud') {
        return await this.sendViaCloudAPI(formattedNumber, message);
      } else {
        return await this.sendViaEvolution(formattedNumber, message);
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return {
        success: false,
        error: 'Failed to send WhatsApp message',
      };
    }
  }

  /**
   * Send via WhatsApp Cloud API (Meta)
   */
  private static async sendViaCloudAPI(to: string, message: string): Promise<{ success: boolean; error?: string }> {
    if (!this.config.phoneNumberId || !this.config.accessToken) {
      console.warn('WhatsApp Cloud API not configured');
      return {
        success: false,
        error: 'WhatsApp Cloud API not configured',
      };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: { body: message },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('WhatsApp Cloud API error:', result);
        return {
          success: false,
          error: result.error?.message || 'Failed to send message',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('WhatsApp Cloud API error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Send via Evolution API
   */
  private static async sendViaEvolution(to: string, message: string): Promise<{ success: boolean; error?: string }> {
    if (!this.config.evolutionUrl || !this.config.evolutionToken || !this.config.evolutionInstance) {
      console.warn('Evolution API not configured');
      return {
        success: false,
        error: 'Evolution API not configured',
      };
    }

    try {
      const response = await fetch(
        `${this.config.evolutionUrl}/message/sendText/${this.config.evolutionInstance}`,
        {
          method: 'POST',
          headers: {
            'apikey': this.config.evolutionToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            number: to,
            text: message,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Evolution API error:', result);
        return {
          success: false,
          error: result.error || 'Failed to send message',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Evolution API error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Send product notification to vendor
   */
  static async notifyVendor(
    vendorPhone: string,
    productName: string,
    customerSource: string
  ): Promise<{ success: boolean; error?: string }> {
    const message = `Nouveau clic WhatsApp !\n\nProduit : ${productName}\nSource : ${customerSource}\n\nConsultez vos analytics sur linkpro.cm`;

    const formattedNumber = vendorPhone.replace(/\+/g, '');

    if (this.config.provider === 'cloud') {
      return await this.sendViaCloudAPI(formattedNumber, message);
    } else {
      return await this.sendViaEvolution(formattedNumber, message);
    }
  }
}
